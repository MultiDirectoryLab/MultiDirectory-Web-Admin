import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, forwardRef } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";

@Component({
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit, ControlValueAccessor, OnDestroy {
    ngControl!: NgControl;
    hasError = false;
    validRx = new BehaviorSubject<boolean>(false);
    @Output() errorChecked = new EventEmitter<boolean>()
    @Input() disabled: boolean = false;
    unsubscribe = new Subject<boolean>();
    constructor(private injector: Injector, private cdr: ChangeDetectorRef) {
       
    }
    
    innerValue: any = '';

    get value(): any {
        return this.innerValue;
    };

    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this._onChange(v);
        }
    }

    private _onChange = (value: any) => {};
    private _onTouched = () => {};

    writeValue(value: any): void {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.cdr.detectChanges();
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.detectChanges();
    }

    onBlur() {
        this._onTouched();
        this.hasError = !this.ngControl.valid;
        this.cdr.detectChanges();

    }

    ngOnInit(): void {
        this.ngControl = this.injector.get(NgControl);
        this.ngControl.statusChanges!
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(validStatus => {
                this.validRx.next(validStatus == 'VALID');
                this.cdr.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
}