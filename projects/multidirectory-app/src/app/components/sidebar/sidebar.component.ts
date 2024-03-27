import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { LdapEntryNode } from "../../core/ldap/ldap-entity";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: [ './sidebar.component.scss' ]
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
    unsubscribe = new Subject<void>();
    
    get user(): WhoamiResponse {
        return this.app.user;
    }

    constructor(private app: AppSettingsService, private router: Router) {        
    }
  
    ngAfterViewInit(): void {

    }

    
    logout() {
        localStorage.clear();
        this.app.user = new WhoamiResponse({});
        this.router.navigate(['/login'])
    }

    openAccountSettings() {
        if(!this.app.userEntry) {
            return;
        }
        this.openEntityProperties(this.app.userEntry);
    }

    openEntityProperties(entity: LdapEntryNode) {
        return;
        //this.properties!.open({'width': '600px', 'minHeight': 660 }, { "selectedEntity": entity }).pipe(take(1)).subscribe(x => {
        //    this.navigation.setCatalog(this.navigation.selectedCatalog, this.navigation.page, [entity]);
        //});
    }

    openChangePassword(entity: LdapEntryNode | undefined = undefined) {
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}