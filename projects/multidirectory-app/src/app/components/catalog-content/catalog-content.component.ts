import { ChangeDetectorRef, Component, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { SearchEntry, SearchResponse } from "../../models/entry/search-response";
import { Subject } from "rxjs";
import { ContextMenuEvent, DatagridComponent, DropdownMenuComponent } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchQueries } from "../../core/ldap/search";

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
    styleUrls: ['./catalog-content.component.scss']
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
    @ViewChild('propGrid', { static: true }) propGrid!: DatagridComponent;

    @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
    columns: TableColumn[] = [];
    contextRow?: LdapNode;
    properties?: any[];

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
        this.ldap.getContent(this._parentNode.entry.object_name).subscribe(x => {
            this.rows = x.map(node => <TableRow>{
                icon: node.icon ?? '',
                name: node.name ?? '',
                type: node.entry ? this.getType(node.entry) : '',
                entry: node,
                description: ''
            });
            this.cdr.detectChanges();
        });
    }


    getType(entry: SearchEntry): string | undefined {
        const objectClass = entry.partial_attributes.find(x => x.type == 'objectClass');
        if(objectClass?.vals.includes('group')) {
            return 'Группа безопасности';
        }
        if(objectClass?.vals.includes('user')) {
            return 'Пользователь';
        }
        if(objectClass?.vals.includes('organizationalUnit')) {
            return 'Орагнизационная единица';
        }
        console.log(objectClass);
        return '';
    }

    onSelect(event: any) {
        if(event?.row?.entry) {
            this.parentNode = event.row.entry;
            if(this.parentNode)
                this.selectedNodeChanged.next(this.parentNode);
        }
    }

    showContextMenu(event: ContextMenuEvent) {
        this.contextMenu.setPosition(
            event.event.clientX, 
            event.event.clientY);
        this.contextRow = event.content.entry;
        this.contextMenu.toggle();
    }

    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    
    showProperties() {
        this.api.search(
            SearchQueries.getProperites(this.contextRow!.id)
        ).subscribe(resp => {
            this.properties = resp.search_result[0].partial_attributes.map( x => {
                return {
                    name: x.type,
                    val: x.vals.join(';')
                }
            });
            this.properitesModal.open();
            this.propGrid.grid.recalculate();
            this.cdr.detectChanges();

        });
    }
}

