import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DropdownMenuComponent, MdModalComponent, Page } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { Subject, forkJoin, switchMap, takeUntil } from "rxjs";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { DeleteEntryRequest } from "../../models/entry/delete-request";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { EntityPropertiesComponent } from "../entity-properties/entity-properties.component";
import { GroupCreateComponent } from "../forms/group-create/group-create.component";
import { OuCreateComponent } from "../forms/ou-create/ou-create.component";
import { UserCreateComponent } from "../forms/user-create/user-create.component";
import { TableViewComponent } from "./views/table-view/table-view.component";
import { ViewMode } from "./view-modes";
import { ContentViewService } from "../../services/content-view.service";
import { BaseViewComponent, RightClickEvent } from "./views/base-view.component";

@Component({
    selector: 'app-catalog-content',
    templateUrl: './catalog-content.component.html',
    styleUrls: ['./catalog-content.component.scss'],
})
export class CatalogContentComponent implements OnInit, OnDestroy {      
    @ViewChild('contextMenu', { static: true }) contextMenuRef!: DropdownMenuComponent;
    @ViewChild('createUserModal', { static: true}) createUserModal?: UserCreateComponent;
    @ViewChild('createGroupModal', { static: true}) createGroupModal?: GroupCreateComponent;
    @ViewChild('createOuModal', { static: true}) createOuModal?: OuCreateComponent;
    @ViewChild('properites', { static: true }) propertiesModal?: MdModalComponent;
    @ViewChild('propData', { static: true }) propertiesData?: EntityPropertiesComponent;

    @ViewChild(BaseViewComponent, { static: false }) view?: BaseViewComponent;

    selectedCatalog: LdapNode =  new LdapNode({ id: '' });
    rows: LdapNode[] = [];
    selectedRows: LdapNode[] = [];

    unsubscribe = new Subject<void>();

    ViewMode = ViewMode;
    get currentView() {
        return this.contentView.contentView;
    }

    page = new Page();

    constructor(
        public navigation: LdapNavigationService,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private contentView: ContentViewService) {}

    ngOnInit(): void {
        this.navigation.nodeSelected.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                this.selectedCatalog = x.parent;
                this.selectedRows = x.node ? [ x.node ] : [];
                this.page.totalElements = (this.selectedCatalog.childCount ?? 0) ?? 0;
                if(x.parent?.parent) {
                    this.page.totalElements += 1;
                }
                return this.navigation.getContent(this.selectedCatalog, this.page);
            }),
        ).subscribe(x => {
            this.rows = x;
            this.view?.setContent(this.rows, this.selectedRows);
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    
    deleteSelectedEntry() {
        forkJoin(
            this.selectedRows.map(x => 
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

    showEntryProperties() { 
        this.propertiesData!.entityDn = this.selectedRows[0].id; 
        this.propertiesData!.loadData().subscribe(x => {
            this.propertiesModal!.open();
            this.propertiesData?.propGrid.grid.recalculate();
            this.propertiesModal!.center();
        });
    }

    loadData() {
        if(this.selectedCatalog) {
            this.navigation.setCatalog(this.selectedCatalog);
        }
    }

    pageChanged(page: Page) {
        this.page = page;
        this.loadData();
        this.cdr.detectChanges();
    }

    showContextMenu(event: RightClickEvent) {
        this.contextMenuRef.setPosition(event.pointerEvent.x, event.pointerEvent.y);
        this.selectedRows = event.selected;
        this.contextMenuRef.toggle();
    }
}

