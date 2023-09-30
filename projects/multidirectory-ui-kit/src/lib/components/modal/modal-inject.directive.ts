import {
    ChangeDetectorRef,
    Directive,
    EmbeddedViewRef,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { MdModalComponent } from './modal.component';
import { Observable, Subject, take } from 'rxjs';

@Directive({
    selector: '[modalInject]',
    exportAs: 'modalInject'
})
export class ModalInjectDirective implements OnInit, OnChanges {
    templateView?: EmbeddedViewRef<any>;
    private _modal?: MdModalComponent;
    constructor(
        private templateRef: TemplateRef<any>,
        private renderer: Renderer2,
        private viewContainerRef: ViewContainerRef,
        private cdr: ChangeDetectorRef
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
      this.templateView?.detectChanges();
    }
    
    ngOnInit(): void {
    }

    private findModalParts(nodes: HTMLElement[]) {
        const header = nodes.filter(x => (x?.classList?.contains('app-modal-header') ?? false));
        const footer = nodes.filter(x => (x?.classList?.contains('app-modal-footer') ?? false));
        const body   = nodes.filter(x => (!x?.classList?.contains('app-modal-footer') &&
                                          !x?.classList?.contains('app-modal-header')));
        return [header, body, footer];
    }

    private _resultRx = new Subject<any | boolean | null>();
    get resultRx(): Observable<any | boolean | null> {
        return this._resultRx.asObservable();
    }
    get modal(): MdModalComponent | undefined {
        return this._modal;
    }

    open(modalOptions?: {[key: string]: any }): Observable<any | boolean | null> {
        this.templateView = this.viewContainerRef.createEmbeddedView(this.templateRef); 
        let nodes = this.findModalParts(this.templateView.rootNodes);
        if(nodes.some(x => !x || x.length == 0)) {
            nodes = this.findModalParts(Array.from(this.templateView.rootNodes.flatMap(x => Array.from(x.children))));
        }
        const wrapped = this.viewContainerRef.createComponent(MdModalComponent, {
            projectableNodes: nodes
        });
        if(modalOptions) {
            Object.entries(modalOptions).forEach(x => { wrapped.setInput(x[0], x[1])});
        }
        this._modal = wrapped.instance;
        this.cdr.detectChanges();   
        this._modal!.open();
        this._modal?.onClose.pipe(take(1)).subscribe(x => {
            this.close();
        })
        this.cdr.detectChanges();   
        return this.resultRx;
    }

    close(result: any | boolean | null = null) {
        this._resultRx.next(result);
        this._modal?.close();
        this.viewContainerRef.clear();
    }
}