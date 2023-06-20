import { ChangeDetectorRef, Component, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { Subject } from "rxjs";
import { ContextMenuEvent, DatagridComponent, DropdownMenuComponent } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { EntityInfoResolver } from "../../core/ldap/entity-info-resolver";
import { DeleteEntryRequest } from "../../models/entry/delete-request";
import { CreateEntryRequest, LdapPartialAttribute } from "../../models/entry/create-request";
import { Toast, ToastrService } from "ngx-toastr";
import { UserCreateComponent } from "../forms/user-create/user-create.component";
import { OuCreateComponent } from "../forms/ou-create/ou-create.component";

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
    private _selectedNode?: LdapNode;
    get selectedNode(): LdapNode | undefined { return this._selectedNode; }
    @Input() set selectedNode(val: LdapNode | undefined) { 
        this._selectedNode = val; 
        this.loadData()
    }
    @Output() selectedNodeChanged = new Subject<LdapNode>();
    rows: TableRow[] = [];
    @ViewChild('contextMenu', { static: true }) contextMenu!: DropdownMenuComponent;
    @ViewChild('properites', { static: true }) properitesModal!: DropdownMenuComponent;
    @ViewChild('grid', { static: true }) grid!: DatagridComponent;
    @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
    @ViewChild('createUserModal', { static: true}) createUserModal?: UserCreateComponent;
    @ViewChild('createOuModal', { static: true}) createOuModal?: OuCreateComponent;
    columns: TableColumn[] = [];
    contextRow?: LdapNode;


    constructor(
        private ldap: LdapTreeBuilder, 
        private cdr: ChangeDetectorRef,
        private api: MultidirectoryApiService,
        private toastr: ToastrService) {}

    ngOnInit(): void {
        this.columns = [
            { name: 'Имя', cellTemplate: this.iconColumn, flexGrow: 1 },
            { name: 'Тип', prop: 'type', flexGrow: 1 },
            { name: 'Описание', prop: 'description', flexGrow: 3 }
        ];    
    }

    loadData() {
        if(this._selectedNode?.entry?.object_name == undefined) {
            return;
        }
        this.ldap.getContent(this._selectedNode.entry.object_name, this.selectedNode!).subscribe(x => {
            this.rows = x.map(node => <TableRow>{
                icon: node.icon ?? '',
                name: node.name ?? '',
                type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
                entry: node,
                description: '',
            });
            if(this._selectedNode?.parent) {
                this.rows = [<TableRow>{
                    name: '...',
                    entry: this._selectedNode
                }].concat(this.rows);
            }
            this.cdr.detectChanges();
        });
    }

    onSelect(event: any) {
        if(event?.row?.entry) {
            this.selectedNode = event.row.entry;
            if(this.selectedNode)
                this.selectedNodeChanged.next(this.selectedNode);
        }
        if(event.row?.name == '...') {
            this.selectedNode = event.row.entry.parent;
            if(this.selectedNode)
                this.selectedNodeChanged.next(this.selectedNode);
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
    deleteSelectedEntry() {
        this.api.delete(new DeleteEntryRequest({
            entry: this.contextRow!.id
        })).subscribe(x => {
            this.loadData();
        });
    }
    redraw() {
        this.loadData();
    }

    openCreateUser() {
        if(!this.selectedNode?.id) {
            this.toastr.error('Выберите каталог в котором будет создан пользователь');
            return;
        }
        this.createUserModal?.open();
    }

    openCreateOu() {
        if(!this.selectedNode?.id) {
            this.toastr.error('Выберите каталог в котором будет создана организационная единица');
            return;
        }
        this.createOuModal?.open();
    }
}

