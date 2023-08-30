import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Page } from "multidirectory-ui-kit";
import { LdapEntity } from "../../../core/ldap/ldap-entity";

export interface RightClickEvent {
    selected: LdapEntity[],
    pointerEvent: PointerEvent
}

@Component({
    selector: 'app-base-view',
    template: ''
})
export abstract class BaseViewComponent {
    @Input() selectedCatalog: LdapEntity | null = null;
    @Output() pageChanged = new EventEmitter<Page>();
    @Output() onRightClick = new EventEmitter<RightClickEvent>();

    @Input() page = new Page();

    onPageChanged(page: Page) {
        this.pageChanged.emit(page);
    }

    handleRightClick(event: any) {
        const selected = this.getSelected();
        if(selected.length == 0) {
            this.setSelected([ event.content?.entry ]);
        }
        if(event instanceof PointerEvent) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.onRightClick.emit({
            pointerEvent: (event instanceof PointerEvent)? event : event.event,
            selected: this.getSelected() ?? []
        });
    }

    abstract setContent(rows: LdapEntity[], selectedNodes: LdapEntity[]): void;
    abstract getSelected(): LdapEntity[];
    abstract setSelected(selected: LdapEntity[]): void;
    
    setCatalog(catalog: LdapEntity): void {
        this.selectedCatalog = catalog;
    }
}