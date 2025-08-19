import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  Signal,
  TemplateRef,
  ViewContainerRef,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';
import { CommonModule } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';

export class DropdownOption {
  title: string = '';
  value: any;

  constructor(obj: Partial<DropdownOption>) {
    Object.assign(this, obj);
  }
}

@Component({
  selector: 'md-dropdown',
  styleUrls: ['./dropdown.component.scss'],
  templateUrl: 'dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, CommonModule],
})
export class DropdownComponent extends BaseComponent {
  private dropdownTemplate = viewChild.required<TemplateRef<any>>('dropdownTemplate');
  private trigger = viewChild.required<ElementRef>('trigger');
  private overlay = inject(Overlay);
  private overlayRef?: OverlayRef;
  private vcr = inject(ViewContainerRef);

  selectedOption?: DropdownOption;
  options = input<DropdownOption[]>([]);
  allowSearch = input(false);
  placeholder = input('Пожалуйста, выберите значение');
  searchTerm = '';

  openDropdown() {
    if (this.overlayRef) return; // already open
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger())
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ])
      .withViewportMargin(8)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'searchable-select-panel',
      width: undefined, // 👈 important: don’t force it
      minWidth: undefined,
      maxWidth: undefined,
    });

    const portal = new TemplatePortal(this.dropdownTemplate(), this.vcr);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());
  }

  override writeValue(value: DropdownOption): void {
    this.selectedOption = this.options().find((x) => {
      if (typeof x === 'string') {
        return x == value;
      }
      return (<DropdownOption>x)?.value == <DropdownOption>value;
    });
    if (this.selectedOption?.value !== this.innerValue) {
      this.innerValue = this.selectedOption?.value;
      this.cdr.detectChanges();
    }
  }

  closeDropdown() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.searchTerm = '';
  }

  selectOption(option: DropdownOption) {
    this.value = option.value;
    this.selectedOption = option;
    this.closeDropdown();
  }

  filteredOptions() {
    if (!this.searchTerm) return this.options();
    return this.options().filter((o) =>
      o.title.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  getTitle(value: string) {
    const option = this.options().find((x) => x.value == value);
    return option?.title;
  }
}
