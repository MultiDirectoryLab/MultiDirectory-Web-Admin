import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Page } from "multidirectory-ui-kit";
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { NavigationEvent } from "projects/multidirectory-app/src/app/services/app-navigation.service";

export interface RightClickEvent {
    selected: LdapEntryNode[],
    pointerEvent: PointerEvent
}

@Component({
    selector: 'app-base-view',
    template: ''
})
export abstract class BaseViewComponent implements OnInit {
    @Input() selectedCatalog: LdapEntryNode | null = null;
    @Output() pageChanged = new EventEmitter<Page>();
    @Output() onRightClick = new EventEmitter<RightClickEvent>();

    @Input() page = new Page();

    ngOnInit(): void {
        const pageSize = localStorage.getItem('gridSize_table-view');
        if(pageSize && !isNaN(parseFloat(pageSize))) {
            this.page.size = Math.floor(parseFloat(pageSize));
            this.pageChanged.emit(this.page);
        }
    }

    onPageChanged(page: Page) {
        this.pageChanged.emit(page);
    }

    handleRightClick(event: any) {
        let selected = this.getSelected();
        if(selected.length == 0 && !!event.content?.entry) {
            this.setSelected([ event.content?.entry ]);
        }
        if(event instanceof PointerEvent) {
            event.preventDefault();
            event.stopPropagation();
        }
        selected = this.getSelected();
        if(!selected || selected.length == 0) {
            return;
        }
        this.onRightClick.emit({
            pointerEvent: (event instanceof PointerEvent)? event : event.event,
            selected: this.getSelected()
        });
    }

    abstract updateContent(e: NavigationEvent): void;
    abstract getSelected(): LdapEntryNode[];
    abstract setSelected(selected: LdapEntryNode[]): void;
    
    setCatalog(catalog: LdapEntryNode): void {
        this.selectedCatalog = catalog;
    }
}