import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, noop, takeUntil } from "rxjs";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { LdapNavigationService } from "../../services/ldap-navigation.service";

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
    constructor(private app: AppSettingsService, private navigation: LdapNavigationService) {
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