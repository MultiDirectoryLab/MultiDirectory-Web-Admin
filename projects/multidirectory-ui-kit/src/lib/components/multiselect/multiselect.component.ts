import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  Input,
  model,
  output,
  viewChild,
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
  protected override cdr = inject(ChangeDetectorRef);
  private readonly _inputContainer = viewChild.required<ElementRef<HTMLElement>>('inputContainer');
  private readonly _menuContainer = viewChild.required<DropdownContainerDirective>(
    DropdownContainerDirective,
  );

  suppressMenu = input<boolean>(false);
  notFoundText = input<string>('Опции не найдены');
  maxMenuHeight = input<number | undefined>();
  containerHeightLimit = input<number | undefined>();
  options = input.required<MultiselectModel[]>();

  inputChanged = output<string>();
  itemSelected = output<MultiselectModel[]>();

  selectedData = model.required<MultiselectModel[]>();
  filteredOptions = computed<MultiselectModel[]>(() => {
    return this.options().filter((x) => !this.selectedData().some((y) => y.id == x.id));
  });

  constructor() {
    super();
  }

  preventEnterKey(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.inputChanged.emit(this._inputContainer().nativeElement.innerText);
    }
    if (event.key == 'Backspace' && this._inputContainer().nativeElement.innerText.length === 0) {
      if (this.selectedData().length > 0) {
        const items = this.selectedData().splice(this.selectedData.length - 1);
        items.forEach((x) => (x.selected = false));
      }
      this.itemSelected.emit(this.selectedData());
    }
  }

  onQueryChange(event: KeyboardEvent) {
    const text = this._inputContainer().nativeElement.innerText;
    if (!text) {
      if (this._menuContainer()?.isVisible()) {
        this._menuContainer()?.toggleMenu();
      }
      this.cdr.detectChanges();
      return;
    }
    if (!this.suppressMenu()) {
      this.showMenu();
    }
    if (event.key == 'ArrowDown') {
      this._menuContainer().focus();
    }
    this.value = text;
    this.cdr.detectChanges();
  }

  showMenu() {
    if (!!this._menuContainer()?.isVisible()) {
      return;
    }
    this._menuContainer().toggleMenu(
      false,
      this._inputContainer().nativeElement.offsetWidth,
      this.maxMenuHeight(),
    );
  }

  onElementSelect(select: MultiselectModel) {
    select.selected = true;
    this.selectedData().push(select);
    this.itemSelected.emit(this.selectedData());
    this._inputContainer().nativeElement.innerText = '';
    this._inputContainer().nativeElement.focus();
    this._menuContainer().toggleMenu();
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
    this.selectedData.set(this.selectedData().filter((x) => x !== select));
    this.itemSelected.emit(this.selectedData());
  }

  onContainerClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._inputContainer().nativeElement.focus();
  }

  override writeValue(value: any): void {
    if (this._inputContainer) {
      this._inputContainer().nativeElement.innerText = value;
    }
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.cdr.detectChanges();
    }
  }
}
