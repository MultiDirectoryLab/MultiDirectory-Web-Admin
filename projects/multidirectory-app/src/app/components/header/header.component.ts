import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, noop, takeUntil } from "rxjs";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { ContentViewService } from "../../services/content-view.service";
import { ViewMode } from "../catalog-content/view-modes";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { DropdownMenuComponent, PlaneButtonComponent } from "multidirectory-ui-kit";

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
    selectedCatalog?: LdapNode;
    ldapRoots: LdapNode[] = [];

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
        private hotkeysService: HotkeysService) 
    {
        this.hotkeysService.add(new Hotkey('ctrl+h', (event: KeyboardEvent): boolean => {
            this.onChange(!this.navigationalPanelInvisible);
            return false; // Prevent bubbling
        }, undefined, 'Показать/скрыть навигационную панель'));
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
        this.navigation.nodeSelected.pipe(takeUntil(this.unsubscribe)).subscribe(node => {
            this.selectedCatalog = node.parent;
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
}