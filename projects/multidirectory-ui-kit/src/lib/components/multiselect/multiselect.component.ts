import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, forwardRef } from "@angular/core";
import { MultiselectModel } from "./mutliselect-model";
import { DropdownContainerDirective } from "../dropdown-menu/dropdown-container.directive";
import { BaseComponent } from "../base-component/base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'md-multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MultiselectComponent),
        multi: true
    }]
})
export class MultiselectComponent extends BaseComponent {
    @ViewChild('inputContainer') inputContainer?: ElementRef<HTMLElement>;
    @ViewChild('menuContainer', { read: DropdownContainerDirective }) menuContainer?: DropdownContainerDirective;
    constructor(cdr: ChangeDetectorRef) { super(cdr); }
    selectedData: MultiselectModel[] = [];
    private _options: MultiselectModel[]  = [];
    @Input() set options(value: MultiselectModel[]) {
      value = value.filter(x => !this.selectedData.some(y => y.id == x.id));
      this._options = value;
      this._originalOptions = JSON.parse(JSON.stringify(value));
    };
    get options(): MultiselectModel[] {
      return this._options;
    }

    private _originalOptions:  MultiselectModel[] = [];

    preventEnterKey(event: KeyboardEvent) {
      if(event.key == 'Enter') {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    onChange(event: KeyboardEvent) {
        const text = this.inputContainer?.nativeElement.innerText;
        if(!text) {
            if(this.menuContainer?.isVisible()) {
                this.menuContainer?.toggleMenu();
            }
            this.cdr.detectChanges();
            return;
        }

        this._options = this._originalOptions.filter(x => x.title.toLocaleLowerCase().includes(
            text.toLocaleLowerCase()) && !this.selectedData.some(y => y.id == x.id));
            
        if(!this.menuContainer?.isVisible())
            this.menuContainer?.toggleMenu(false, this.inputContainer?.nativeElement.offsetWidth);

        if(event.key == 'ArrowDown') {
            this.menuContainer?.focus();
        }
        this.value = text;
        this.cdr.detectChanges();
    }

    onElementSelect(select: MultiselectModel) {
        select.selected = true;
        this.selectedData.push(select);
        this.inputContainer!.nativeElement.innerText = '';
        this.inputContainer!.nativeElement.focus();
        this.menuContainer?.toggleMenu();
    }
    onOptionKey(event: KeyboardEvent, select: MultiselectModel) {
      if(event.key == 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.onElementSelect(select);
        return;
      }
    }

    onBadgeClose(select: MultiselectModel) {
      this.selectedData = this.selectedData.filter(x => x != select);
    }
}