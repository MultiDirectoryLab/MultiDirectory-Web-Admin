import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { TreeviewComponent } from "multidirectory-ui-kit";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, take, takeUntil } from "rxjs";
import { CatalogContentComponent } from "../catalog-content/catalog-content.component";
import { LdapNavigationService } from "../../services/ldap-navigation.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
    get tree(): LdapNode[] {
        return <LdapNode[]>this.navigation.ldapRoot!;
    }
    rootDse: LdapNode[] = [];

    user?: WhoamiResponse;
    showLeftPane = false;
    @ViewChild('treeView') treeView?: TreeviewComponent;
    @ViewChild('catalogContent') catalogContent?: CatalogContentComponent;

    unsubscribe = new Subject<boolean>();
    constructor(
        private router: Router, 
        private api: MultidirectoryApiService, 
        private navigation: LdapNavigationService,
        private app: AppSettingsService) {
        
        this.navigation.init();

        this.api.whoami().subscribe(whoami=> {
            this.user = whoami;
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
}