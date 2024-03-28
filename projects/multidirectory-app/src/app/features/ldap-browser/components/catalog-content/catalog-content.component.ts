import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { DropdownMenuComponent, ModalInjectDirective, Page } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { LdapEntryLoader } from "projects/multidirectory-app/src/app/core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";
import { AppNavigationService } from "projects/multidirectory-app/src/app/services/app-navigation.service";
import { AppWindowsService } from "projects/multidirectory-app/src/app/services/app-windows.service";
import { ContentViewService } from "projects/multidirectory-app/src/app/services/content-view.service";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { Subject, take, takeUntil } from "rxjs";
import { ViewMode } from "./view-modes";
import { BaseViewComponent, RightClickEvent } from "./views/base-view.component";
 
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

    unsubscribe = new Subject<void>();

    ViewMode = ViewMode;
    currentView = this.contentView.contentView;

    constructor(
        private navigation: AppNavigationService,
        private ldapLoader: LdapEntryLoader,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private contentView: ContentViewService,
        private ldapWindows: AppWindowsService,
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

        this.navigation.navigationRx
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((e) => {
                this.view?.updateContent(e);
                this.cdr.detectChanges();
            });
        /*
        this.navigation.selectedCatalogRx.pipe(
            takeUntil(this.unsubscribe),
            switchMap((catalog) => {
               // this.selectedCatalog = catalog;
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
*/
        this.contentView.contentViewRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.currentView = x;
            this.cdr.detectChanges();
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    
    deleteSelectedEntry() {
        /*concat(...this.selectedRows.map(x => 
            this.api.delete(new DeleteEntryRequest({
                entry: (<any>x.entry).object_name
            }))
        )).subscribe(x => {
            this.loadData();
        });*/
    }

    openCreateUser() {
        this.createUserModal?.open({ 'width': '600px', 'minHeight': 485 }).pipe(take(1)).subscribe(() => {
            //this.loadData();
        });
    }

    openCreateGroup() {
        this.createGroupModal?.open({ 'width': '580px', 'minHeight': 485 }).pipe(take(1)).subscribe(() => {
            //this.loadData();
        });
    }

    openCreateOu() {
        this.createOuModal?.open({ 'width': '580px', 'minHeight': 485 }).pipe(take(1)).subscribe(x => {
            //this.loadData();
        });
    }

    showEntryProperties() { 
        /*
        if(!this.navigation.selectedEntity?.[0]) {
            return;
        }
        this.ldapWindows.openEntityProperiesModal(this.navigation.selectedEntity[0]);*/
    }

    showChangePassword() {
        /*if(!this.navigation.selectedEntity?.[0]) {
            return;
        }
        this.ldapWindows.openChangePasswordModal(this.navigation.selectedEntity[0]);*/
    }

    pageChanged(page: Page) {
        //this.navigation.setPage(page);
        this.cdr.detectChanges();
    }

    showContextMenu(event: RightClickEvent) {
        this.contextMenuRef.setPosition(event.pointerEvent.x, event.pointerEvent.y);
//        this.selectedRows = event.selected;
        this.contextMenuRef.toggle();
    }

    
    @HostListener('keydown', ['$event']) 
    handleKeyEvent(event: KeyboardEvent) {
        if(event.key == 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            //this.navigation.setCatalog(null);
        }
    }
}

