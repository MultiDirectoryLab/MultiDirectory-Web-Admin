import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, noop, takeUntil } from "rxjs";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { ContentViewService } from "../../services/content-view.service";
import { ViewMode } from "../catalog-content/view-modes";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
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

    constructor(private app: AppSettingsService, private navigation: LdapNavigationService, private contentViewService: ContentViewService) {
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
}