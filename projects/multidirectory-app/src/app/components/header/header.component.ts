import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, noop, takeUntil } from "rxjs";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { ContentViewService } from "../../services/content-view.service";
import { ViewMode } from "../catalog-content/view-modes";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { LdapEntity } from "../../core/ldap/ldap-entity";
import { MenuService } from "../../services/menu.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() helpMenuClick = new EventEmitter<MouseEvent>();
    @ViewChild('searchBtn', { read: ElementRef }) searchBtn?: ElementRef; 
    unsubscribe = new Subject<boolean>();
    navigationalPanelInvisible = false;
    selectedCatalog: LdapEntity | null = null;
    ldapRoots: LdapEntity[] = [];

    ViewMode = ViewMode;
    get contentView(): ViewMode {
        return this.contentViewService.contentView;
    }
    set contentView(view: ViewMode) {
        this.contentViewService.contentView = view;
    }

    constructor(
        private app: AppSettingsService,
        private navigation: LdapNavigationService,
        private contentViewService: ContentViewService,
        private hotkeysService: HotkeysService,
        private menu: MenuService,
        private cdr: ChangeDetectorRef) 
    {
        this.hotkeysService.add(new Hotkey('ctrl+h', (event: KeyboardEvent): boolean => {
            this.onChange(!this.navigationalPanelInvisible);
            return false; // Prevent bubbling
        }, undefined, 'Показать/скрыть навигационную панель'));
        this.hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
            this.navigation.setCatalog(null);
            return false; // Prevent bubbling
        }, undefined, 'Режим отображения - маленькие иконки'));
        this.hotkeysService.add(new Hotkey('f1', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.SmallIcons;
            return false; // Prevent bubbling
        }, undefined, 'Режим отображения - маленькие иконки'));
        this.hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.BigIcons;
            return false; // Prevent bubbling
        }, undefined, 'Режим отображения - большие иконки'));
        this.hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.Table;
            return false; // Prevent bubbling
        }, undefined, 'Режим отображения - список'));
        this.hotkeysService.add(new Hotkey('f4', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.Details;
            return false; // Prevent bubbling
        }, undefined, 'Режим отображения - Детали')); 
        this.hotkeysService.add(new Hotkey('ctrl+f', (event: KeyboardEvent): boolean => {
            this.searchBtn?.nativeElement.click();
            return false;
        }, undefined, 'Показать меню поиска'))
    }
    ngOnInit(): void {
        this.navigation.ldapRootRx.subscribe(x => {
            this.ldapRoots = x;
        });
        this.navigation.selectedCatalogRx.pipe(takeUntil(this.unsubscribe)).subscribe(catalog => {
            this.selectedCatalog = catalog;
            this.cdr.detectChanges();
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onChange(value: boolean) {
        this.navigationalPanelInvisible = value;
        this.app.setNavigationalPanelVisiblity(!this.navigationalPanelInvisible);
        window.dispatchEvent(new Event('resize'));
    }
    showHelp() {
        this.hotkeysService.cheatSheetToggle.next(true);
    }
    closeCatalog() {
        this.navigation.setCatalog(null);
        this.cdr.detectChanges();
    }
    openAccessControl() {
        this.menu.showAccessControlMenu();
    }
}