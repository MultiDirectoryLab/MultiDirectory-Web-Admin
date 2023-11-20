import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { DropdownMenuComponent, ModalInjectDirective, Page } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, concat, switchMap, take, takeUntil } from "rxjs";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { DeleteEntryRequest } from "../../../models/entry/delete-request";
import { ContentViewService } from "../../../services/content-view.service";
import { LdapWindowsService } from "../../../services/ldap-windows.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { ViewMode } from "./view-modes";
import { BaseViewComponent, RightClickEvent } from "./views/base-view.component";
import { LdapEntityType } from "../../../core/ldap/ldap-entity-type";
import { ChangePasswordComponent } from "../editors/change-password/change-password.component";
import { translate } from "@ngneat/transloco";
 
@Component({
    selector: 'app-catalog-content',
    templateUrl: './catalog-content.component.html',
    styleUrls: ['./catalog-content.component.scss'],
})
export class CatalogContentComponent implements OnInit, OnDestroy {      
    @ViewChild('contextMenu', { static: true }) contextMenuRef!: DropdownMenuComponent;
    @ViewChild('createUserModal', { static: true}) createUserModal?: ModalInjectDirective;
    @ViewChild('createGroupModal', { static: true}) createGroupModal?: ModalInjectDirective;
    @ViewChild('createOuModal', { static: true}) createOuModal?: ModalInjectDirective;
    @ViewChild('properties', { static: true }) properties?: ModalInjectDirective;
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
        private ldapWindows: LdapWindowsService,
        private hotkeysService: HotkeysService) {
        }

    ngOnInit(): void {
        this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
            this.openCreateUser();
            return false;
        }, undefined, translate('hotkeys.create-user')));
        this.hotkeysService.add(new Hotkey('ctrl+g', (event: KeyboardEvent): boolean => {
            this.openCreateGroup();
            return false;
        }, undefined, translate('hotkeys.create-group')));
        this.hotkeysService.add(new Hotkey('ctrl+u', (event: KeyboardEvent): boolean => {
            this.openCreateOu();
            return false;
        }, undefined, translate('hotkeys.create-ou')));
        this.hotkeysService.add(new Hotkey('ctrl+l', (event: KeyboardEvent): boolean => {
            return false;
        }, undefined, translate('hotkeys.access-control')));
        
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
            if(this.view) {
                this.view.selectedCatalog = this.selectedCatalog; 
            }
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

    LdapEntityType = LdapEntityType;
    isSelectedRowsOfType(selectedRowsType: LdapEntityType) {
        return this.selectedRows.every(x => x.type == selectedRowsType);
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
        if(!this.selectedCatalog?.entry) {
            this.toastr.info(translate('catalog-content.select-user-catalog'));
            return;
        }
        this.createUserModal?.open({ 'width': '600px', 'minHeight': 485 }).pipe(take(1)).subscribe(() => {
            this.loadData();
        });
    }

    openCreateGroup() {
        if(!this.selectedCatalog?.entry) {
            this.toastr.info(translate('catalog-content.select-group-catalog'));
            return;
        }
        this.createGroupModal?.open({ 'width': '580px' }).pipe(take(1)).subscribe(() => {
            this.loadData();
        });
    }

    openCreateOu() {
        if(!this.selectedCatalog?.entry) {
            this.toastr.info(translate('catalog-content.select-ou-catalog'));
            return;
        }
        this.createOuModal?.open().pipe(take(1)).subscribe(x => {
            this.loadData();
        });
    }

    showEntryProperties() { 
        if(!this.navigation.selectedEntity?.[0]) {
            return;
        }
        this.ldapWindows.openEntityProperiesModal(this.navigation.selectedEntity[0]);
    }

    showChangePassword() {
        if(!this.navigation.selectedEntity?.[0]) {
            return;
        }
        this.ldapWindows.openChangePasswordModal(this.navigation.selectedEntity[0]);
    }

    loadData() {
        if(this.selectedCatalog) {
            this.navigation.setCatalog(this.selectedCatalog, this.navigation.page);
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

    
    @HostListener('keydown', ['$event']) 
    handleKeyEvent(event: KeyboardEvent) {
        if(event.key == 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            this.navigation.setCatalog(null);
        }
    }
}

