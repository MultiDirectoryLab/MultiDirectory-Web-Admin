import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, forwardRef } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { DatagridComponent, DropdownMenuComponent, DropdownOption, Page, Treenode } from "multidirectory-ui-kit";
import { EntityInfoResolver } from "projects/multidirectory-app/src/app/core/ldap/entity-info-resolver";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { Subject } from "rxjs";
import { TableRow } from "./table-row";
import { BaseViewComponent } from "../base-view.component";
import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { translate } from "@ngneat/transloco";
import { LdapWindowsService } from "projects/multidirectory-app/src/app/services/ldap-windows.service";

@Component({
    selector: 'app-table-view',
    styleUrls: ['table-view.component.scss'],
    templateUrl: './table-view.component.html',
    providers: [
        { provide: BaseViewComponent, useExisting: forwardRef(() => TableViewComponent) }
    ]
})
export class TableViewComponent extends BaseViewComponent implements OnInit, OnDestroy {
    @ViewChild('grid', { static: true }) grid!: DatagridComponent;
    @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;

    columns: TableColumn[] = [];
    rows: TableRow[] = [];
    unsubscribe = new Subject<void>();
    pageSizes: DropdownOption[] = [
        { title: '15', value: 15 },
        { title: '20', value: 20 },
        { title: '30', value: 30 },
        { title: '50', value: 50 },
        { title: '100', value: 100 }
    ]
    constructor(
        private navigation: LdapNavigationService,
        private windows: LdapWindowsService,
        private cdr: ChangeDetectorRef
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.columns = [
            { name: translate("table-view.name-column"), cellTemplate: this.iconColumn, flexGrow: 1 },
            { name: translate("table-view.type-column"), prop: 'type', flexGrow: 1 },
            { name: translate("table-view.description-column"), prop: 'description', flexGrow: 3 }
        ];    
    }

    ngOnDestroy(): void {
        if(this.unsubscribe) {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
    }

    override setContent(nodes: LdapEntity[], selectedNodes: LdapEntity[] = []) {
        this.rows = nodes.map(node => <TableRow>{
            icon: node.icon ?? '',
            name: node.name ?? '',
            type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
            entry: node,
            description: '',
        });

        this.grid.totalElements = this.selectedCatalog!.childCount!;
        if(this.selectedCatalog?.parent) {
            this.selectedCatalog.parent.selected = false;
            /*this.rows = [<TableRow>{
                name: '...',
                entry: this.selectedCatalog
            }].concat(this.rows);
            this.grid.page.totalElements += Math.ceil(this.selectedCatalog!.childCount! / this.page.size);
            */
        }
        this.grid.selected = this.rows.filter( x => selectedNodes.findIndex(y => y.id == x.entry.id) > -1);
        this.cdr.detectChanges();
    }

    override getSelected(): LdapEntity[] {
        return this.grid.selected.map(x => x.entry);
    }
    override setSelected(selected: LdapEntity[]) {
        if(!this.rows || this.rows.length == 0 || !selected) {
            return;
        }
        this.grid.selected = this.rows.filter( x => selected.findIndex(y => y.id == x.entry.id) > -1);
        this.navigation.setSelection(selected);
        this.cdr.detectChanges();
    }
    onSingleClick(event: any) {
        this.navigation.setSelection(event.map((x: TableRow) => x.entry));
    }
    onDoubleClick(event: any) {
        const entry = event?.row?.entry;
        if(event?.row?.name == '...') {
            this.navigation.setCatalog(this.selectedCatalog?.parent!);
        } else if(entry && entry.expandable) {
            const page = new Page(this.page);
            page.pageNumber = 1;
            this.navigation.setCatalog(entry, page);
        } else if(entry && !entry.expandable) {
            this.windows.openEntityProperiesModal(entry);
        }
        this.cdr.detectChanges();
    }
}