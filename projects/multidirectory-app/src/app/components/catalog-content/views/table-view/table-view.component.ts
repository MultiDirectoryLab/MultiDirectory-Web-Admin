import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, forwardRef } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { DatagridComponent, DropdownMenuComponent, Page, Treenode } from "multidirectory-ui-kit";
import { EntityInfoResolver } from "projects/multidirectory-app/src/app/core/ldap/entity-info-resolver";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { Subject } from "rxjs";
import { TableRow } from "./table-row";
import { BaseViewComponent } from "../base-view.component";

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

    constructor(
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef
    ) {
        super();
    }

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

    override setContent(nodes: LdapNode[], selectedNodes: LdapNode[] = []) {
        this.rows = nodes.map(node => <TableRow>{
            icon: node.icon ?? '',
            name: node.name ?? '',
            type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
            entry: node,
            description: '',
        });

        this.grid.page.totalElements = this.selectedCatalog!.childCount!;
        if(this.selectedCatalog?.parent) {
            this.selectedCatalog.parent.selected = false;
            this.rows = [<TableRow>{
                name: '...',
                entry: this.selectedCatalog
            }].concat(this.rows);
            this.grid.page.totalElements += 1;
        }
        this.grid.selected = this.rows.filter( x => selectedNodes.findIndex(y => y.id == x.entry.id) > -1);
        this.cdr.detectChanges();
    }

    override getSelected(): LdapNode[] {
        return this.grid.selected.map(x => x.entry);
    }


    onDoubleClick(event: any) {
        if(event?.row?.name == '...') {
            this.navigation.setCatalog(this.selectedCatalog?.parent!);
        } else if(event?.row?.entry) {
            this.navigation.setCatalog(event.row.entry);
        }
        this.cdr.detectChanges();
    }
}