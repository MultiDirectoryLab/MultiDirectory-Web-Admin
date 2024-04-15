import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, InjectionToken, Input, OnDestroy, QueryList, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, NgControl, NgModel } from "@angular/forms";
import { BehaviorSubject, Observable, Subject, combineLatest, takeUntil } from "rxjs";
import { BaseComponent } from "../base-component/base.component";
    
export const MD_FORM = new InjectionToken<MdFormComponent>('MDFORM');

@Component({
    selector: 'md-form',
    styleUrls: ['./form.component.scss'],
    templateUrl: './form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: MD_FORM,
            useExisting: forwardRef(() => MdFormComponent),
            multi: true
        }
    ]
})
export class MdFormComponent implements AfterViewInit, OnDestroy {
    @ContentChildren(NgControl, {descendants: true}) inputs!: QueryList<NgControl>;
    @ContentChildren(NG_VALUE_ACCESSOR, {descendants: true}) valueAccessors!: QueryList<BaseComponent>;
    @Input() autocomplete = false;
    inputValidators: Observable<string>[] = [];
    unsubscribe = new Subject<void>();

    private _valid = new BehaviorSubject(false);
    get valid(){
        return this._valid.value;
    }
    get onValidChanges() {
        return this._valid.asObservable();
    }
    
    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        this.valueAccessors.forEach(va => {
            const input = this.inputs.find(x => x.valueAccessor == va);
            if(input) {
                va.controlAccessor = input;
                if(input.validator){
                    input.validator(input.control!);
                }
            }
        });
        this.cdr.detectChanges();
        this.inputValidators = this.inputs.toArray()/*.filter(x => !!x)*/.map(x => x.statusChanges!);
        combineLatest(this.inputValidators).pipe(
            takeUntil(this.unsubscribe),
        ).subscribe(va => {
            this._valid.next(va.every(x => x == 'VALID' || x == 'DISABLED'));
        });
    }

    validate() {
        this.inputs.forEach(x => {
            if(x.control?.dirty) {
                x.control?.updateValueAndValidity()
            }
        });
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

