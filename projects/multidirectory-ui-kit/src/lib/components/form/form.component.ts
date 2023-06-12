import { OnDestroy, ViewChildren, forwardRef } from "@angular/core";
import { AfterViewInit, Component, ContentChildren, Directive, OnInit, QueryList, Renderer2, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, Subject, merge, takeUntil } from "rxjs";
import { ErrorAwareDirective } from "./error-aware.directive";


@Component({
    selector: 'md-form',
    styleUrls: ['./form.component.scss'],
    templateUrl: './form.component.html'
})
export class MdFormComponent implements AfterViewInit, OnDestroy {
    @ViewChildren(ErrorAwareDirective) content!: QueryList<ErrorAwareDirective>;
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

