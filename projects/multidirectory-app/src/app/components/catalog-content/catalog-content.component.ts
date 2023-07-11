import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { ContextMenuEvent, DatagridComponent, DropdownMenuComponent, MdModalComponent, Page } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, forkJoin, of, takeUntil, tap } from "rxjs";
import { EntityInfoResolver } from "../../core/ldap/entity-info-resolver";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { DeleteEntryRequest } from "../../models/entry/delete-request";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { GroupCreateComponent } from "../forms/group-create/group-create.component";
import { OuCreateComponent } from "../forms/ou-create/ou-create.component";
import { UserCreateComponent } from "../forms/user-create/user-create.component";
import { EntityPropertiesComponent } from "../entity-properties/entity-properties.component";
import { LdapNavigationService } from "../../services/ldap-navigation.service";

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
export class CatalogContentComponent implements OnInit, OnDestroy {
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
    @ViewChild('createGroupModal', { static: true}) createGroupModal?: GroupCreateComponent;
    @ViewChild('createOuModal', { static: true}) createOuModal?: OuCreateComponent;
    @ViewChild('properites', { static: true }) propertiesModal?: MdModalComponent;
    @ViewChild('propData', { static: true }) propertiesData?: EntityPropertiesComponent;

    columns: TableColumn[] = [];
    contextRows: LdapNode[] = [];
    page: Page = new Page();
    unsubscribe = new Subject<void>();

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

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadData() {
        return this.loadDataRx().subscribe();
    }

    loadDataRx(): Observable<LdapNode[]> {
        if(this._selectedNode?.entry?.object_name == undefined) {
            return of([]);
        }
        return this.ldap.getContent(this._selectedNode.entry.object_name, this._selectedNode, this.page).pipe(
            tap(x => {
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
            }));
    }

    select(node: LdapNode) {
        const row = this.rows.find(x => x.entry.id == node.id);
        this.grid.select(row);
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
        if(this.grid.selected.length == 0) {
            this.contextRows = [ event.content.entry ];
            this.grid.select(event);
        } else {
            this.contextRows = this.grid.selected.map(x => x.entry);
        }
        this.contextMenu.toggle();
        this.cdr.detectChanges();
    }
    deleteSelectedEntry() {
        forkJoin(
            this.contextRows.map(x => 
                this.api.delete(new DeleteEntryRequest({
                    entry: (<any>x.entry).id
                }))
            )
        ).subscribe(x => {
            this.loadData();
        });
    }

    onPageChanged(page: Page) {
        this.page = page;
        this.loadData();
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

    openCreateGroup() {
        if(!this.selectedNode?.id) {
            this.toastr.error('Выберите каталог в котором будет создан пользователь');
            return;
        }
        this.createGroupModal?.open();
    }

    openCreateOu() {
        if(!this.selectedNode?.id) {
            this.toastr.error('Выберите каталог в котором будет создана организационная единица');
            return;
        }
        this.createOuModal?.open();
    }

    showEntryProperties() { 
        this.propertiesModal!.open();
        this.propertiesData!.entityDn = this.contextRows[0].id; 
        this.propertiesData!.loadData();
    }
}

