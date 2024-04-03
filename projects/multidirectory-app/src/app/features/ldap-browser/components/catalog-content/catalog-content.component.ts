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
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { LdapEntryType } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-type";
import { ContextMenuService } from "projects/multidirectory-app/src/app/services/contextmenu.service";
 
@Component({
    selector: 'app-catalog-content',
    templateUrl: './catalog-content.component.html',
    styleUrls: ['./catalog-content.component.scss'],
})
export class CatalogContentComponent implements OnInit, OnDestroy {      
    @ViewChild('properties', { static: true }) properties?: ModalInjectDirective;
    @ViewChild(BaseViewComponent) view?: BaseViewComponent;

    unsubscribe = new Subject<void>();
    LdapEntryType = LdapEntryType;
    ViewMode = ViewMode;
    currentView = this.contentView.contentView;
    private _selectedRows: LdapEntryNode[] = [];

    constructor(
        private navigation: AppNavigationService,
        private cdr: ChangeDetectorRef,
        private contentView: ContentViewService,
        private windows: AppWindowsService,
        private contextMenu: ContextMenuService,
        private hotkeysService: HotkeysService) {
        }

    ngOnInit(): void {
        this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
            this.windows.openCreateUser();
            return false;
        }, undefined, translate('hotkeys.create-user')));
        this.hotkeysService.add(new Hotkey('ctrl+g', (event: KeyboardEvent): boolean => {
            this.windows.openCreateGroup();
            return false;
        }, undefined, translate('hotkeys.create-group')));
        this.hotkeysService.add(new Hotkey('ctrl+u', (event: KeyboardEvent): boolean => {
            this.windows.openCreateOu();
            return false;
        }, undefined, translate('hotkeys.create-ou')));
        this.hotkeysService.add(new Hotkey('ctrl+l', (event: KeyboardEvent): boolean => {
            return false;
        }, undefined, translate('hotkeys.access-control')));

        this.navigation.navigationRx
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((e) => {
                this.view?.updateContent();
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

   
    showEntryProperties() { 
        this.windows.openEntityProperiesModal(this._selectedRows[0]).pipe(take(1)).subscribe(x => {
            this.view?.updateContent()
        })
    }

    showChangePassword() {
        //this.ldapWindows.openChangePasswordModal(this.navigation.selectedEntity[0]);
    }

    openCreateUser() {}
    openCreateGroup() {}
    openCreateOu() {}

    pageChanged(page: Page) {
        //this.navigation.setPage(page);
        this.cdr.detectChanges();
    }

    showContextMenu(event: RightClickEvent) {
        this.contextMenu.showContextMenuOnNode(event.pointerEvent.x, event.pointerEvent.y, event.selected[0]);
        /*
        this.contextMenuRef.setPosition(event.pointerEvent.x, event.pointerEvent.y);
        this._selectedRows = event.selected;
        this.contextMenuRef.toggle();*/
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

