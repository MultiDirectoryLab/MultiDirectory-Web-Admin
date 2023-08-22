import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subject, concat, forkJoin, from, map, switchMap, take, takeUntil, tap } from "rxjs";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { DeleteEntryRequest } from "../../models/entry/delete-request";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { GroupCreateComponent } from "../forms/group-create/group-create.component";
import { OuCreateComponent } from "../forms/ou-create/ou-create.component";
import { UserCreateComponent } from "../forms/user-create/user-create.component";
import { ViewMode } from "./view-modes";
import { ContentViewService } from "../../services/content-view.service";
import { BaseViewComponent, RightClickEvent } from "./views/base-view.component";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { EntityAttributesComponent } from "../entity-properties/entity-attributes/entity-attributes.component";
import { DropdownMenuComponent, MdModalComponent, Page } from "multidirectory-ui-kit";

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
    @ViewChild('propData', { static: true }) propertiesData?: EntityAttributesComponent;
    @ViewChild(BaseViewComponent) view?: BaseViewComponent;

    selectedCatalog: LdapNode =  new LdapNode({ id: '' });
    rows: LdapNode[] = [];
    selectedRows: LdapNode[] = [];

    unsubscribe = new Subject<void>();

    ViewMode = ViewMode;
    currentView = this.contentView.contentView;

    constructor(
        public navigation: LdapNavigationService,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private contentView: ContentViewService,
        private hotkeysService: HotkeysService) {
            this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
                this.openCreateUser();
                return false;
            }, undefined, 'Создать пользователя'));
            this.hotkeysService.add(new Hotkey('ctrl+g', (event: KeyboardEvent): boolean => {
                this.openCreateGroup();
                return false;
            }, undefined, 'Создать группу'));
            this.hotkeysService.add(new Hotkey('ctrl+u', (event: KeyboardEvent): boolean => {
                this.openCreateOu();
                return false;
            }, undefined, 'Создать организационную единицу'));
        }

    ngOnInit(): void {
        this.navigation.nodeSelected.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                this.selectedCatalog = x.parent;
                this.selectedRows = x.node ? [ x.node ] : [];
                if(x.page) {
                    this.navigation.page = x.page;
                }
                this.navigation.page.totalElements = (this.selectedCatalog.childCount ?? 0) ?? 0;
                if(x.parent?.parent) {
                    this.navigation.page.totalElements += 1;
                }
                return this.navigation.getContent(this.selectedCatalog, this.navigation.page);
            }),
        ).subscribe(x => {
            this.rows = x;
            this.view!.selectedCatalog = this.selectedCatalog; 
            this.view?.setContent(this.rows, this.selectedRows);
            this.cdr.detectChanges();
        });

        this.contentView.contentViewRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.currentView = x;
            this.cdr.detectChanges();
            this.navigation.setCatalog(this.selectedCatalog);
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    
    deleteSelectedEntry() {
        concat(...this.selectedRows.map(x => 
            this.api.delete(new DeleteEntryRequest({
                entry: (<any>x.entry).object_name
            }))
        )).subscribe(x => {
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
        this.createOuModal!.setupRequest = '';
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

    loadData(page: Page | undefined = undefined) {
        if(!!page) {
            this.navigation.page = page;
        } else {
            this.navigation.page.pageNumber = 1;
        }
        if(this.selectedCatalog) {
            this.navigation.setCatalog(this.selectedCatalog);
        }
    }

    pageChanged(page: Page) {
        this.loadData(page);
        this.cdr.detectChanges();
    }

    showContextMenu(event: RightClickEvent) {
        this.contextMenuRef.setPosition(event.pointerEvent.x, event.pointerEvent.y);
        this.selectedRows = event.selected;
        this.contextMenuRef.toggle();
    }
}

