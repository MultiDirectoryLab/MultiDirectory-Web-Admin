import { Directive,
    Input,
    TemplateRef,
    ViewContainerRef } from '@angular/core';

@Directive({
selector: '[rerender]'
})
export class RerenderDirective {
    constructor(
        private templateRef:    TemplateRef<any>,
        private viewContainer:  ViewContainerRef
    ) {
        console.log('render', this.templateRef);
    }

    // if detects changes of the input `val`, clear and rerender the view
    @Input() set rerender(val: any) {
        console.log('render');
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
    }
}