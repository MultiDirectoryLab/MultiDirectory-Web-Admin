import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  inject,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { MdPortalService } from '../../portal/portal.service';
import { MdModalComponent } from '../modal.component';
import { MdModalService } from '../modal.service';
import { getModalParts } from './modal-inject-helper';
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
export class ModalInjectDirective implements OnChanges, OnDestroy {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private getViewContainerRef = inject(PORTAL_AWARE_VIEW_CONTAINER_RESOLVER);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(MdModalService);

  private templateView!: EmbeddedViewRef<any>;
  private _modalWrapper?: ComponentRef<MdModalComponent>;
  private viewContainerRef!: ViewContainerRef;
  private unsubscribe = new Subject<void>();
  contentOptions: { [key: string]: any } = {};

  private _resultRx = new Subject<any | boolean | null>();

  get resultRx(): Observable<any | boolean | null> {
    return this._resultRx.asObservable();
  }

  get modal(): MdModalComponent {
    return this._modalWrapper!.instance;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.templateView?.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  open(
    modalOptions?: { [key: string]: any },
    contentOptions?: { [key: string]: any },
  ): Observable<any | boolean | null> {
    if (this._modalWrapper) {
      return of(false);
    }
    this.viewContainerRef = this.getViewContainerRef();
    this.templateView = this.viewContainerRef.createEmbeddedView(this.templateRef);
    const nodes = getModalParts(this.templateView.rootNodes);
    this._modalWrapper = this.viewContainerRef.createComponent(MdModalComponent, {
      projectableNodes: nodes,
    });
    if (modalOptions) {
      Object.entries(modalOptions).forEach((x) => {
        this._modalWrapper!.setInput(x[0], x[1]);
      });
    }

    if (contentOptions) {
      this.contentOptions = contentOptions;
    }

    this.modal?.closeModal.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      if (this.closeWrapperFn(null)) {
        this.shutdownWindow(null);
      }
    });

    this.modalService.push(this.modal);
    this.modal.open();
    this.modalService.focusLastModal();
    this.cdr.detectChanges();
    return this.resultRx;
  }

  close(result: any | boolean | null = null) {
    this.shutdownWindow(result);
  }

  closeWrapperFn: (result: any) => boolean = (result: any) => true;

  resizeToContentHeight() {
    this.modal.resizeToContentHeight();
  }

  showSpinner() {
    this.modal.showSpinner();
  }

  hideSpinner() {
    this.modal.hideSpinner();
  }

  private shutdownWindow(result: any) {
    this.modal.visible = false;
    this._resultRx.next(result);
    this.templateView.destroy();
    this._modalWrapper!.destroy();
    this.modalService.pop();
    this._modalWrapper = undefined;
    this.modalService.focusLastModal();
  }
}
