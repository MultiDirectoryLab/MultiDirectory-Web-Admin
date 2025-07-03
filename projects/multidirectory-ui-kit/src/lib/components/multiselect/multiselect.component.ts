import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';
import { DropdownContainerDirective } from '../dropdown-menu/dropdown-container.directive';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { MultiselectBadgeComponent } from './multiselect-badge/multiselect-badge.component';
import { MultiselectModel } from './mutliselect-model';

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
  imports: [DropdownContainerDirective, MultiselectBadgeComponent, DropdownMenuComponent],
})
export class MultiselectComponent extends BaseComponent {
  private _originalOptions: MultiselectModel[] = [];
  protected override cdr = inject(ChangeDetectorRef);
  @Input() suppressMenu = false;
  @Input() notFoundText = 'Опции не найдены';
  @Input() maxMenuHeight?: number;
  @Output() inputChanged = new EventEmitter<string>();
  @ViewChild('inputContainer') inputContainer!: ElementRef<HTMLElement>;
  @ViewChild('menuContainer', { read: DropdownContainerDirective })
  menuContainer!: DropdownContainerDirective;
  selectedData: MultiselectModel[] = [];

  private _options: MultiselectModel[] = [];

  get options(): MultiselectModel[] {
    return this._options;
  }

  @Input() set options(value: MultiselectModel[]) {
    value = value.filter((x) => !this.selectedData.some((y) => y.id == x.id));
    this._options = value;
    this._originalOptions = JSON.parse(JSON.stringify(value));
    if (value.some((x) => x.selected)) {
      this.selectedData = this.selectedData.concat(value.filter((x) => x.selected));
    }
  }

  constructor() {
    super();
  }

  preventEnterKey(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.inputChanged.emit(this.inputContainer.nativeElement.innerText);
    }
    if (event.key == 'Backspace' && this.inputContainer.nativeElement.innerText.length === 0) {
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
    this.menuContainer?.toggleMenu(
      false,
      this.inputContainer?.nativeElement.offsetWidth,
      this.maxMenuHeight,
    );
  }

  onElementSelect(select: MultiselectModel) {
    select.selected = true;
    this.selectedData.push(select);
    this.inputContainer.nativeElement.innerText = '';
    this.inputContainer.nativeElement.focus();
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

  onContainerClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.inputContainer.nativeElement.focus();
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
