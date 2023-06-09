import { OnDestroy, ViewChildren, forwardRef } from "@angular/core";
import { AfterViewInit, Component, ContentChildren, Directive, OnInit, QueryList, Renderer2, ViewContainerRef } from "@angular/core";
import { NgControl } from "@angular/forms";
import { BehaviorSubject, Subject, merge, takeUntil } from "rxjs";

@Directive({
    selector: '[mdErrorMessage]',
})
export class ErrorMessageDirective implements OnInit, OnDestroy {
    errorLabel: any;
    unsubscribe = new Subject<void>();
    validRx = new BehaviorSubject<boolean>(false);
    get valid(): boolean {
        return this.validRx.getValue();
    }
    constructor(
        private el: ViewContainerRef, 
        private ngControl: NgControl,
        private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.errorLabel = this.renderer.createElement('label');
        this.renderer.addClass(this.errorLabel, 'error-message');
        if(this.el.element.nativeElement.name) {
            this.renderer.setAttribute(this.errorLabel, 'for', this.el.element.nativeElement.name);
        }
        this.renderer.appendChild(this.el.element.nativeElement, this.errorLabel);
        this.ngControl.statusChanges?.pipe(takeUntil(this.unsubscribe)).subscribe(status => {
            this.renderer.setProperty(this.errorLabel, 'innerHTML', '');
            this.validRx.next(this.ngControl.valid ?? false);
            if(this.ngControl.touched || this.ngControl.dirty)
            {
                if(this.ngControl.errors?.['required']) {
                    this.renderer.setProperty(this.errorLabel, 'innerHTML', 'Value is required');
                }
            }
        });

    }
       
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    } 
}

@Component({
    selector: 'md-form',
    styleUrls: ['./form.component.scss'],
    templateUrl: './form.component.html'
})
export class MdFormComponent implements AfterViewInit, OnDestroy {
    @ViewChildren(ErrorMessageDirective) content!: QueryList<ErrorMessageDirective>;
    @ContentChildren(MdFormComponent, { descendants: true }) children!: QueryList<MdFormComponent>
    toListenValidator: BehaviorSubject<boolean>[] = [];
    unsubscribe = new Subject<void>();

    valid = new BehaviorSubject(false);

    ngAfterViewInit(): void {
        this.children.changes.subscribe(_ => {
            this.toListenValidator = this.content!.map(x => x.validRx);
            this.children.forEach(child => {
                this.toListenValidator.push(child.valid);
            });
            merge(...this.toListenValidator).pipe(
                takeUntil(this.unsubscribe)).subscribe(result => this.valid.next(result));
        });
        console.log('content', this);
        this.toListenValidator = this.content!.map(x => x.validRx);
        this.children.forEach(child => {
            this.toListenValidator.push(child.valid);
        });
        merge(...this.toListenValidator).pipe(
            takeUntil(this.unsubscribe)).subscribe(result => this.valid.next(result));
    }
    
    getChildrenValidator(): BehaviorSubject<boolean> {
        return this.valid;
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

