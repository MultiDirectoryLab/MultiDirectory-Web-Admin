import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { DatagridComponent, DropdownMenuComponent, Page } from "multidirectory-ui-kit";
import { EntityInfoResolver } from "projects/multidirectory-app/src/app/core/ldap/entity-info-resolver";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { Subject } from "rxjs";
import { TableRow } from "./table-row";

@Component({
    selector: 'app-table-view',
    styleUrls: ['table-view.component.scss'],
    templateUrl: './table-view.component.html'
})
export class TableViewComponent implements OnInit, OnDestroy {
    @ViewChild('grid', { static: true }) grid!: DatagridComponent;
    @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
    @Input() contextMenu!: DropdownMenuComponent;
    @Input() selectedCatalog?: LdapNode;
    private _content:  LdapNode[] = [];
    @Input() set content(x: LdapNode[]) {
        this.mapRows(x);
    } 
    get content() {
        return this._content;
    }

    columns: TableColumn[] = [];
    contextRows: LdapNode[] = [];
    rows: TableRow[] = [];
    unsubscribe = new Subject<void>();
    private _page = new Page();
    @Input() set page(p: Page) {
        this._page = p;
        //this.grid.setPage(p);
    }
    get page(): Page {
        return this._page;
    }
    @Output() pageChanged = new EventEmitter<Page>();

    constructor(
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.columns = [
            { name: 'Имя', cellTemplate: this.iconColumn, flexGrow: 1 },
            { name: 'Тип', prop: 'type', flexGrow: 1 },
            { name: 'Описание', prop: 'description', flexGrow: 3 }
        ];    
    }

    ngOnDestroy(): void {
        if(this.unsubscribe) {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
    }

    onPageChanged(page: Page) {
        console.log(page);
        this.pageChanged.emit(page);
    }

    mapRows(nodes: LdapNode[]) {
        this.rows = nodes.map(node => <TableRow>{
            icon: node.icon ?? '',
            name: node.name ?? '',
            type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
            entry: node,
            description: '',
        });

        this.grid.page.totalElements = this.selectedCatalog!.childCount!;
        if(this.selectedCatalog?.parent) {
            this.rows = [<TableRow>{
                name: '...',
                entry: this.selectedCatalog
            }].concat(this.rows);
            this.grid.page.totalElements += 1;
        }
        this.cdr.detectChanges();
    }


    onDoubleClick(event: any) {
        if(event?.row?.name == '...') {
            this.navigation.setCatalog(this.selectedCatalog?.parent!);
        } else if(event?.row?.entry) {
            this.navigation.setCatalog(event.row.entry);
        }
        this.cdr.detectChanges();
    }

    showContextMenu(event: any) {
        this.contextMenu.setPosition(
            event.event.clientX, 
            event.event.clientY); 
        if(this.grid.selected.length == 0) {
            this.contextRows = [ event.content.entry ];
            this.grid.select(event);
        } else {
            this.contextRows = this.grid.selected.map(x => x.entry);
        }
        this.contextMenu.toggle();
        this.cdr.detectChanges();
    }

    select(selectedRows: LdapNode[]) {
        const rows = this.rows.filter(x => selectedRows.some( y => y.id == x.entry.id));
        this.grid.select(rows[0]);
        this.cdr.detectChanges();
    }
}