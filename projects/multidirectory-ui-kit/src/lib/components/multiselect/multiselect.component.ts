import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { MultiselectModel } from './mutliselect-model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';
import { DropdownContainerDirective } from '../dropdown-menu/dropdown-container.directive';

@Component({
  selector: 'md-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectComponent),
      multi: true,
    },
  ],
})
export class MultiselectComponent extends BaseComponent {
  @Input() suppressMenu = false;
  @Input() notFoundText = 'Опции не найдены';
  @Output() onEnter = new EventEmitter<string>();
  @ViewChild('inputContainer') inputContainer?: ElementRef<HTMLElement>;
  @ViewChild('menuContainer', { read: DropdownContainerDirective })
  menuContainer?: DropdownContainerDirective;
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  selectedData: MultiselectModel[] = [];
  private _options: MultiselectModel[] = [];

  @Input() set options(value: MultiselectModel[]) {
    value = value.filter((x) => !this.selectedData.some((y) => y.id == x.id));
    this._options = value;
    this._originalOptions = JSON.parse(JSON.stringify(value));
    if (value.some((x) => x.selected)) {
      this.selectedData = this.selectedData.concat(value.filter((x) => x.selected));
    }
  }
  get options(): MultiselectModel[] {
    return this._options;
  }

  private _originalOptions: MultiselectModel[] = [];

  preventEnterKey(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.onEnter.emit(this.inputContainer?.nativeElement.innerText);
    }
    if (event.key == 'Backspace' && this.inputContainer?.nativeElement.innerText.length === 0) {
      if (this.selectedData.length > 0) {
        const items = this.selectedData.splice(this.selectedData.length - 1);
        items.forEach((x) => (x.selected = false));
      }
    }
  }

  onChange(event: KeyboardEvent) {
    const text = this.inputContainer?.nativeElement.innerText;
    if (!text) {
      if (this.menuContainer?.isVisible()) {
        this.menuContainer?.toggleMenu();
      }
      this.cdr.detectChanges();
      return;
    }

    this._options = this._originalOptions.filter(
      (x) =>
        x.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) &&
        !this.selectedData.some((y) => y.id == x.id),
    );
    if (!this.suppressMenu) {
      this.showMenu();
    }
    if (event.key == 'ArrowDown') {
      this.menuContainer?.focus();
    }
    this.value = text;
    this.cdr.detectChanges();
  }

  showMenu() {
    if (!!this.menuContainer?.isVisible()) {
      return;
    }
    this.menuContainer?.toggleMenu(false, this.inputContainer?.nativeElement.offsetWidth);
  }

  onElementSelect(select: MultiselectModel) {
    select.selected = true;
    this.selectedData.push(select);
    this.inputContainer!.nativeElement.innerText = '';
    this.inputContainer!.nativeElement.focus();
    this.menuContainer?.toggleMenu();
  }
  onOptionKey(event: KeyboardEvent, select: MultiselectModel) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.onElementSelect(select);
      return;
    }
  }

  onBadgeClose(select: MultiselectModel) {
    this.selectedData = this.selectedData.filter((x) => x != select);
  }

  override writeValue(value: any): void {
    if (!value) {
      this._options = [];
      this._originalOptions = [];
    }
    if (this.inputContainer) {
      this.inputContainer.nativeElement.innerText = value;
    }
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.cdr.detectChanges();
    }
  }
}
