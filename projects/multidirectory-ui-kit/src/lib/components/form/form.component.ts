import { ChangeDetectionStrategy, ChangeDetectorRef, InjectionToken, Input, OnChanges, OnDestroy, SimpleChanges, ViewChildren, forwardRef } from "@angular/core";
import { AfterViewInit, Component, ContentChildren, Directive, OnInit, QueryList, Renderer2, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, Observable, Subject, combineLatest, merge, of, pipe, startWith, takeUntil, tap } from "rxjs";
import { BaseComponent } from "../base-component/base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'md-form',
    styleUrls: ['./form.component.scss'],
    templateUrl: './form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdFormComponent implements AfterViewInit, OnDestroy {
    @Input() formId = '';
    @ViewChildren(NG_VALUE_ACCESSOR) inputs!: QueryList<BaseComponent>;
    @ContentChildren(MdFormComponent, { descendants: true }) forms!: QueryList<MdFormComponent>
    inputValidators: BehaviorSubject<boolean>[] = [];
    formsValidators: BehaviorSubject<boolean>[] = [];

    combinedValidation?: Observable<boolean[]>;
    reloadRx = new Subject<void>();
    unsubscribe = new Subject<void>();

    valid = new BehaviorSubject(false);
    constructor(private cdr: ChangeDetectorRef) {}
    ngAfterViewInit(): void {
        this.inputs.changes.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe(() => {
            this.buildValidRx();        
            this.cdr.detectChanges();
        });

        this.forms.changes.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe(() => {
            this.buildValidRx();
            this.cdr.detectChanges();
        });
        this.buildValidRx();
    }

    buildValidRx() {
        this.valid.next(false);
        
        if(this.combinedValidation) {
            this.reloadRx.next();
            this.reloadRx.complete();
            this.reloadRx = new Subject<void>();
            this.formsValidators.forEach(x => x.complete());
            this.inputValidators.forEach(x => x.complete());
        }
        this.formsValidators = this.forms!.map(x => x.valid);
        this.inputValidators = this.inputs!.map(x => x.validRx);

        const controls = [...this.inputValidators, ...this.formsValidators];
        this.combinedValidation = combineLatest(controls).pipe(
            takeUntil(this.unsubscribe),
            takeUntil(this.reloadRx));

        this.combinedValidation.subscribe(result => {
            this.valid.next(result.reduce((acc, x)=>  acc && x));
        });
    }

    ngOnDestroy(): void {
        this.reloadRx.next();
        this.reloadRx.complete();
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

