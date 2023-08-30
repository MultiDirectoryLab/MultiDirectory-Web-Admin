import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, combineLatest, concat, forkJoin, from, map, merge, switchMap, take, takeUntil, tap, zip } from "rxjs";
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
import { DropdownMenuComponent, Page } from "multidirectory-ui-kit";
import { EntityPropertiesComponent } from "../entity-properties/properties.component";
import { LdapEntity } from "../../core/ldap/ldap-entity";

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
    @ViewChild('properties', { static: true }) properties?: EntityPropertiesComponent;
    
    @ViewChild(BaseViewComponent) view?: BaseViewComponent;

    selectedCatalog: LdapEntity | null = null;
    rows: LdapEntity[] = [];
    selectedRows: LdapEntity[] = [];

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
        this.navigation.selectedCatalogRx.pipe(
            takeUntil(this.unsubscribe),
            switchMap((catalog) => {
                this.selectedCatalog = catalog;
                if(!this.selectedCatalog) {
                    this.cdr.detectChanges();
                    return EMPTY;
                }
                this.selectedRows = this.navigation.selectedEntity ? this.navigation.selectedEntity : [];
                return this.navigation.getContent(this.selectedCatalog, this.navigation.page);
            }),
        ).subscribe(x => {
            this.rows = x;
            this.view!.selectedCatalog = this.selectedCatalog; 
            this.view?.setContent(this.rows, this.selectedRows);
            this.cdr.detectChanges();
        });

        this.navigation.pageRx.pipe(
            takeUntil(this.unsubscribe),
            switchMap((page) => {
                if(!this.selectedCatalog) {
                    return EMPTY;
                }
                return this.navigation.getContent(this.selectedCatalog, page);
            })).subscribe(x => {
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
            if(this.selectedCatalog) {
                this.navigation.setCatalog(this.selectedCatalog);
            }
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
        //this.propertiesData!.entityDn = this.selectedRows[0].id; 
        //this.propertiesData!.loadData().subscribe(x => {
        this.properties!.open();
          //  this.propertiesData?.propGrid.grid.recalculate();
           // this.propertiesModal!.center();
        //});
    }

    loadData() {
        if(this.selectedCatalog) {
        }
    }

    pageChanged(page: Page) {
        this.navigation.setPage(page);
        this.cdr.detectChanges();
    }

    showContextMenu(event: RightClickEvent) {
        this.contextMenuRef.setPosition(event.pointerEvent.x, event.pointerEvent.y);
        this.selectedRows = event.selected;
        this.contextMenuRef.toggle();
    }
}

