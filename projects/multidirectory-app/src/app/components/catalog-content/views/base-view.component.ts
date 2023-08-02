import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Page } from "multidirectory-ui-kit";
import { LdapNode } from "../../../core/ldap/ldap-loader";

export interface RightClickEvent {
    selected: LdapNode[],
    pointerEvent: PointerEvent
}

@Component({
    selector: 'app-base-view',
    template: ''
})
export abstract class BaseViewComponent {
    @Input() selectedCatalog?: LdapNode;
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
        this.onRightClick.emit({
            pointerEvent: event.event,
            selected: this.getSelected() ?? []
        });
    }

    abstract setContent(rows: LdapNode[], selectedNodes: LdapNode[]): void;
    abstract getSelected(): LdapNode[];
    abstract setSelected(selected: LdapNode[]): void;
    
    setCatalog(catalog: LdapNode): void {
        this.selectedCatalog = catalog;
    }
}