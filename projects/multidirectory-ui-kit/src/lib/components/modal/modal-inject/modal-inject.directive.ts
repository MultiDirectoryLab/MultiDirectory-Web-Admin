import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { MdModalComponent } from '../modal.component';
import { getModalParts } from './modal-inject-helper';
import { MdPortalService } from '../../portal/portal.service';
import { MdModalService } from '../modal.service';
import { PORTAL_AWARE_VIEW_CONTAINER_RESOLVER } from './portal-aware-view-container-resolver';

@Directive({
  selector: '[modalInject]',
  exportAs: 'modalInject',
  providers: [
    {
      provide: PORTAL_AWARE_VIEW_CONTAINER_RESOLVER,
      useFactory: (viewContainerRef: ViewContainerRef, portalService: MdPortalService) => {
        return () => portalService.get('dialog-portal') ?? viewContainerRef;
      },
      deps: [ViewContainerRef, MdPortalService],
    },
  ],
})
export class ModalInjectDirective implements OnChanges {
  private templateView!: EmbeddedViewRef<any>;
  private _modalWrapper!: ComponentRef<MdModalComponent>;
  private viewContainerRef!: ViewContainerRef;

  constructor(
    private templateRef: TemplateRef<any>,
    @Inject(PORTAL_AWARE_VIEW_CONTAINER_RESOLVER)
    private getViewContainerRef: () => ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private modalService: MdModalService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.templateView?.detectChanges();
  }

  private _resultRx = new Subject<any | boolean | null>();
  get resultRx(): Observable<any | boolean | null> {
    return this._resultRx.asObservable();
  }

  get modal(): MdModalComponent {
    return this._modalWrapper.instance;
  }

  contentOptions: { [key: string]: any } = {};

  open(
    modalOptions?: { [key: string]: any },
    contentOptions?: { [key: string]: any },
  ): Observable<any | boolean | null> {
    this.viewContainerRef = this.getViewContainerRef();
    this.templateView = this.viewContainerRef.createEmbeddedView(this.templateRef);
    const nodes = getModalParts(this.templateView.rootNodes);
    this._modalWrapper = this.viewContainerRef.createComponent(MdModalComponent, {
      projectableNodes: nodes,
    });
    if (modalOptions) {
      Object.entries(modalOptions).forEach((x) => {
        this._modalWrapper.setInput(x[0], x[1]);
      });
    }

    if (contentOptions) {
      this.contentOptions = contentOptions;
    }

    this.cdr.detectChanges();

    this.modal?.closeModal.pipe(take(1)).subscribe((result) => {
      this._resultRx.next(result);
      this._modalWrapper.destroy();
      this.templateView.destroy();
      this.modalService.pop();
      this.modalService.focusLastModal();
    });

    this.modalService.push(this.modal);
    this.modal.open();
    this.modalService.focusLastModal();
    this.cdr.detectChanges();
    return this.resultRx;
  }

  close(result: any | boolean | null = null) {
    this._resultRx.next(result);
    this.modal.close();
    this.templateView.destroy();
    this._modalWrapper.destroy();
    this.modalService.pop();
    this.modalService.focusLastModal();
  }
}
