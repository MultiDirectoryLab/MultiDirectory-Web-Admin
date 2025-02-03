import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IdProvider } from '../../utils/id-provider';
import { SpinnerHostDirective } from '../spinner/spinner-host.directive';
import { ResizableEvent } from './ng-modal-lib/lib/resizable/types';
import { MdModalService } from './modal.service';
import { BaseControlComponent } from '../base-component/control.component';

@Component({
  selector: 'md-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdModalComponent extends BaseControlComponent implements OnInit, AfterViewChecked {
  override __ID = IdProvider.getUniqueId('modal');

  @ViewChild(SpinnerHostDirective, { static: true }) spinnerHost?: SpinnerHostDirective;

  @Input() scrollTopEnable = false;
  @Input() resizeable = false;
  @Input() maximizable: boolean = false;
  @Input() backdrop = true;
  @Input() inViewport: boolean = false;
  @Input() minHeight = 0;
  @Input() opened = false;
  @Input() width: string = '';
  @Input() closeable = true;
  @Input() spinnerText = '';

  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @ViewChild('modalRoot', { static: false }) modalRoot!: ElementRef;
  @ViewChild('modalBody', { static: false }) modalBody!: ElementRef;
  @ViewChild('modalHeader', { static: false }) modalHeader!: ElementRef;
  @ViewChild('modalFooter', { static: false }) modalFooter!: ElementRef;
  @ViewChild('closeIcon', { static: false }) closeIcon?: ElementRef;
  @ViewChild('overlay', { static: false }) overlay!: ElementRef;

  clearable = false;
  visible: boolean = false;
  rendered: boolean = false;
  executePostDisplayActions: boolean = false;
  maximized: boolean = false;
  preMaximizeRootWidth: number = 0;
  preMaximizeRootHeight: number = 0;
  preMaximizeBodyHeight: number = 0;
  preMaximizePageX: number = 0;
  preMaximizePageY: number = 0;
  dragEventTarget: MouseEvent | TouchEvent = <MouseEvent>{};

  constructor(
    private renderer: Renderer2,
    private modalService: MdModalService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.opened) {
      this.open();
      this.calcBodyHeight();
      this.center();
      this.cdr.detectChanges();
    }
    if (this.width) {
      this.renderer.setStyle(this.modalRoot.nativeElement, 'width', this.width);
    }
    this.focus();
  }

  ngAfterViewChecked(): void {
    if (this.executePostDisplayActions) {
      this.center();
      this.executePostDisplayActions = false;
    }
  }

  @HostListener('keydown.esc', ['$event'])
  onKeyDown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.closeable) {
      return;
    }
    this.close();
  }

  open(): void {
    this.executePostDisplayActions = true;
    this.rendered = true;
    setTimeout(() => {
      if (this.scrollTopEnable) {
        this.modalBody.nativeElement.scrollTop = 0;
      }
    }, 1);
    this.visible = true;
    this.cdr.detectChanges();
  }

  close(): void {
    if (!this.closeable) {
      return;
    }
    this.closeModal.emit();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.executePostDisplayActions = true;
    this.center();
  }

  center(): void {
    let elementWidth = this.modalRoot.nativeElement.offsetWidth;
    let elementHeight = this.modalRoot.nativeElement.offsetHeight;

    if (elementWidth === 0 && elementHeight === 0) {
      this.modalRoot.nativeElement.style.visibility = 'hidden';
      this.modalRoot.nativeElement.style.display = 'flex';
      elementWidth = this.modalRoot.nativeElement.offsetWidth;
      elementHeight = this.modalRoot.nativeElement.offsetHeight;
      this.modalRoot.nativeElement.style.display = 'none';
      this.modalRoot.nativeElement.style.visibility = 'visible';
    }

    const x = Math.max((window.innerWidth - elementWidth) / 2, 0);
    const y = Math.max((window.innerHeight - elementHeight) / 2, 0);

    this.modalRoot.nativeElement.style.left = x + 'px';
    this.modalRoot.nativeElement.style.top = y + 'px';
  }

  initDrag(event: MouseEvent | TouchEvent): void {
    if (this.closeIcon && event.target === this.closeIcon.nativeElement) {
      return;
    }
    if (!this.maximized) {
      this.dragEventTarget = event;
    }
  }

  onResize(event: ResizableEvent): void {
    if (event.direction === 'vertical') {
      this.calcBodyHeight();
    }
  }

  calcBodyHeight(): void {
    const diffHeight =
      this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
    const contentHeight = this.modalRoot.nativeElement.offsetHeight - diffHeight;
    this.modalBody.nativeElement.style.height = contentHeight + 'px';
    this.modalBody.nativeElement.style.maxHeight = 'none';
  }

  getMaxModalIndex(): number {
    return this.modalService.getModalCount();
  }

  focus(): void {
    this.modalRoot?.nativeElement?.focus();
  }

  toggleMaximize(event: Event): void {
    if (this.maximized) {
      this.revertMaximize();
    } else {
      this.maximize();
    }
    event.preventDefault();
  }

  resizeToContentHeight() {
    this.cdr.detectChanges();
    const bodyChildren = this.modalBody.nativeElement.children;
    const bodyRect = this.modalBody.nativeElement.getBoundingClientRect();
    if (!bodyChildren || bodyChildren.length == 0) return;
    const height = Math.max(
      ...[...bodyChildren]
        .map((x) => x.getBoundingClientRect())
        .map((x) => x.top + x.height - bodyRect.top),
    );
    this.modalBody.nativeElement.style.height = height + 16 + 'px';
    this.modalBody.nativeElement.style.maxHeight = 'none';
  }

  maximize(): void {
    this.preMaximizePageX = parseFloat(this.modalRoot.nativeElement.style.top);
    this.preMaximizePageY = parseFloat(this.modalRoot.nativeElement.style.left);
    this.preMaximizeRootWidth = this.modalRoot.nativeElement.offsetWidth;
    this.preMaximizeRootHeight = this.modalRoot.nativeElement.offsetHeight;
    this.preMaximizeBodyHeight = this.modalBody.nativeElement.offsetHeight;

    this.modalRoot.nativeElement.style.top = '0px';
    this.modalRoot.nativeElement.style.left = '0px';
    this.modalRoot.nativeElement.style.width = '100vw';
    this.modalRoot.nativeElement.style.height = '100vh';
    const diffHeight =
      this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
    this.modalBody.nativeElement.style.height = 'calc(100vh - ' + diffHeight + 'px)';
    this.modalBody.nativeElement.style.maxHeight = 'none';

    this.maximized = true;
  }

  revertMaximize(): void {
    this.modalRoot.nativeElement.style.top = this.preMaximizePageX + 'px';
    this.modalRoot.nativeElement.style.left = this.preMaximizePageY + 'px';
    this.modalRoot.nativeElement.style.width = this.preMaximizeRootWidth + 'px';
    this.modalRoot.nativeElement.style.height = this.preMaximizeRootHeight + 'px';
    this.modalBody.nativeElement.style.height = this.preMaximizeBodyHeight + 'px';

    this.maximized = false;
  }

  moveOnTop(): void {
    const maxModalIndex = this.getMaxModalIndex();
    let zIndex = parseFloat(window.getComputedStyle(this.modalRoot.nativeElement).zIndex) || 0;
    if (zIndex <= maxModalIndex) {
      zIndex = maxModalIndex + 1;
      this.overlay.nativeElement.style.zIndex = zIndex.toString();
      this.modalRoot.nativeElement.style.zIndex = (zIndex + 1).toString();
    }
  }

  setVisible(visible: boolean = true) {
    this.visible = visible;
  }

  showSpinner() {
    this.spinnerHost?.show();
  }

  hideSpinner() {
    this.spinnerHost?.hide();
  }
}
