import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ContextMenuEvent, DropdownMenuComponent, MdModalComponent, Page } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { Subject, forkJoin, switchMap, takeUntil } from "rxjs";
import { LdapNode, NodeSelection } from "../../core/ldap/ldap-loader";
import { DeleteEntryRequest } from "../../models/entry/delete-request";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { EntityPropertiesComponent } from "../entity-properties/entity-properties.component";
import { GroupCreateComponent } from "../forms/group-create/group-create.component";
import { OuCreateComponent } from "../forms/ou-create/ou-create.component";
import { UserCreateComponent } from "../forms/user-create/user-create.component";


@Component({
    selector: 'app-catalog-content',
    templateUrl: './catalog-content.component.html',
    styleUrls: ['./catalog-content.component.scss'],
})
export class CatalogContentComponent implements OnInit, OnDestroy {      
    @ViewChild('contextMenu', { static: true }) contextMenu!: DropdownMenuComponent;
    @ViewChild('properites', { static: true }) properitesModal!: DropdownMenuComponent;
    @ViewChild('createUserModal', { static: true}) createUserModal?: UserCreateComponent;
    @ViewChild('createGroupModal', { static: true}) createGroupModal?: GroupCreateComponent;
    @ViewChild('createOuModal', { static: true}) createOuModal?: OuCreateComponent;
    @ViewChild('properites', { static: true }) propertiesModal?: MdModalComponent;
    @ViewChild('propData', { static: true }) propertiesData?: EntityPropertiesComponent;

    page: Page = new Page();
    rows: LdapNode[] = [];

    selectedCatalog: LdapNode =  new LdapNode({ id: '' });
    contextRows: LdapNode[] = [];
    
    unsubscribe = new Subject<void>();

    constructor(
        public navigation: LdapNavigationService,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService) {}

    ngOnInit(): void {
        this.navigation.nodeSelected.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                console.log('test');
                this.selectedCatalog = x.parent;
                const test = this.navigation.getContent(this.selectedCatalog, this.page);
                return test;
            })
        ).subscribe(x => {
            this.rows = x;
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

  
    select(node: LdapNode) {
       // const row = this.rows.find(x => x.entry.id == node.id);
       // this.grid.select(row);
    }

    
    deleteSelectedEntry() {
        forkJoin(
            this.contextRows.map(x => 
                this.api.delete(new DeleteEntryRequest({
                    entry: (<any>x.entry).object_name
                }))
            )
        ).subscribe(x => {
            this.loadData();
        });
    }


    redraw() {
        this.loadData();
    }

    openCreateUser() {
        if(!this.selectedCatalog?.id) {
            this.toastr.error('Выберите каталог в котором будет создан пользователь');
            return;
        }
        this.createUserModal?.open();
    }

    openCreateGroup() {
        if(!this.selectedCatalog?.id) {
            this.toastr.error('Выберите каталог в котором будет создан пользователь');
            return;
        }
        this.createGroupModal?.open();
    }

    openCreateOu() {
        if(!this.selectedCatalog?.id) {
            this.toastr.error('Выберите каталог в котором будет создана организационная единица');
            return;
        }
        this.createOuModal?.open();
    }

    
    showContextMenu(event: ContextMenuEvent) {
        this.contextMenu.setPosition(
            event.event.clientX, 
            event.event.clientY); 
        /**if(this.grid.selected.length == 0) {
            this.contextRows = [ event.content.entry ];
            this.grid.select(event);
        } else {
            this.contextRows = this.grid.selected.map(x => x.entry);
        }**/
        this.contextMenu.toggle();
        this.cdr.detectChanges();
    }

     
    showEntryProperties() { 
        this.propertiesModal!.open();
       // this.propertiesData!.entityDn = this.contextRows[0].id; 
        this.propertiesData!.loadData();
    }

    loadData() {
        if(this.selectedCatalog) {
            this.navigation.setCatalog(this.selectedCatalog);
        }
    }
}

