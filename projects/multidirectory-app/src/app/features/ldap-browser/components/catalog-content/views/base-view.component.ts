import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from 'multidirectory-ui-kit';
import { LdapEntryNode } from '@core/ldap/ldap-entity';

export interface RightClickEvent {
  selected: LdapEntryNode[];
  pointerEvent: PointerEvent;
}

@Component({
  selector: 'app-base-view',
  template: '',
})
export abstract class BaseViewComponent {
  @Input() selectedCatalog: LdapEntryNode | null = null;
  @Output() onRightClick = new EventEmitter<RightClickEvent>();

  handleRightClick(event: any) {
    let selected = this.getSelected();
    if (!!event.content?.entry && !selected.includes(event.content?.entry)) {
      this.setSelected([event.content?.entry]);
    }
    if (event instanceof PointerEvent) {
      event.preventDefault();
      event.stopPropagation();
    }
    selected = this.getSelected();
    if (!selected || selected.length == 0) {
      return;
    }
    this.onRightClick.emit({
      pointerEvent: event instanceof PointerEvent ? event : event.event,
      selected: this.getSelected(),
    });
  }

  abstract updateContent(): void;
  abstract getSelected(): LdapEntryNode[];
  abstract setSelected(selected: LdapEntryNode[]): void;

  setCatalog(catalog: LdapEntryNode): void {
    this.selectedCatalog = catalog;
  }
}
