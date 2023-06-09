import { ChangeDetectorRef, Component, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { Subject } from "rxjs";
import { ContextMenuEvent, DatagridComponent, DropdownMenuComponent } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { EntityInfoResolver } from "../../core/ldap/entity-info-resolver";

export interface TableRow {
    icon?: string,
    name: string,
    type?: string,
    description: string;
    entry: LdapNode;
}

@Component({
    selector: 'app-catalog-content',
    templateUrl: './catalog-content.component.html',
    styleUrls: ['./catalog-content.component.scss'],
})
export class CatalogContentComponent implements OnInit {
    private _parentNode?: LdapNode;
    get parentNode(): LdapNode | undefined { return this._parentNode; }
    @Input() set parentNode(val: LdapNode | undefined) { 
        this._parentNode = val; 
        this.loadData()
    }
    @Output() selectedNodeChanged = new Subject<LdapNode>();
    rows: TableRow[] = [];
    @ViewChild('contextMenu', { static: true }) contextMenu!: DropdownMenuComponent;
    @ViewChild('properites', { static: true }) properitesModal!: DropdownMenuComponent;
    @ViewChild('grid', { static: true }) grid!: DatagridComponent;
    @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
    columns: TableColumn[] = [];
    contextRow?: LdapNode;


    constructor(private ldap: LdapTreeBuilder, private cdr: ChangeDetectorRef, private api: MultidirectoryApiService) {}

    ngOnInit(): void {
        this.columns = [
            { name: 'Имя', cellTemplate: this.iconColumn, flexGrow: 1 },
            { name: 'Тип', prop: 'type', flexGrow: 1 },
            { name: 'Описание', prop: 'description', flexGrow: 3 }
        ];    
    }

    loadData() {
        if(this._parentNode?.entry?.object_name == undefined) {
            return;
        }
        this.ldap.getContent(this._parentNode.entry.object_name, this.parentNode!).subscribe(x => {
            this.rows = x.map(node => <TableRow>{
                icon: node.icon ?? '',
                name: node.name ?? '',
                type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
                entry: node,
                description: '',
            });
            this.rows = [<TableRow>{
                name: '...',
                entry: this._parentNode
            }].concat(this.rows);
            this.cdr.detectChanges();
        });
    }

    onSelect(event: any) {
        if(event?.row?.entry) {
            this.parentNode = event.row.entry;
            if(this.parentNode)
                this.selectedNodeChanged.next(this.parentNode);
        }
        if(event.row?.name == '...') {
            this.parentNode = event.row.entry.parent;
            if(this.parentNode)
                this.selectedNodeChanged.next(this.parentNode);
        }
        this.cdr.detectChanges();
    }

    showContextMenu(event: ContextMenuEvent) {
        this.contextMenu.setPosition(
            event.event.clientX, 
            event.event.clientY);
        this.contextRow = event.content.entry;
        this.grid.select(event.content);
        this.contextMenu.toggle();
        this.cdr.detectChanges();
    }
}

