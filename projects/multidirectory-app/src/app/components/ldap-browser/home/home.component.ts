import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HotkeysCheatsheetComponent } from "angular2-hotkeys";
import { TreeviewComponent } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { WhoamiResponse } from "../../../models/whoami/whoami-response";
import { AppSettingsService } from "../../../services/app-settings.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CatalogContentComponent } from "../catalog-content/catalog-content.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
    get tree(): LdapEntity[] {
        return <LdapEntity[]>this.navigation.ldapRoot!;
    }
    rootDse: LdapEntity[] = [];

    user?: WhoamiResponse;
    showLeftPane = false;
    @ViewChild('treeView') treeView?: TreeviewComponent;
    @ViewChild('catalogContent') catalogContent?: CatalogContentComponent;
    @ViewChild('helpcheatSheet') helpcheatSheet!: HotkeysCheatsheetComponent;
    unsubscribe = new Subject<boolean>();
    constructor(
        private router: Router, 
        private navigation: LdapNavigationService,
        private app: AppSettingsService) {
        this.navigation.init();
        this.app.userRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(user => {
            this.user = user;
        });
        this.app.navigationalPanelVisibleRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.showLeftPane = x;
            this.catalogContent?.redraw();
        })
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login'])
    }

    helpMenuClick() {
        this.helpcheatSheet.toggleCheatSheet();
    }
}