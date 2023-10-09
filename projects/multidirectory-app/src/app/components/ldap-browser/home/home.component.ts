import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HotkeysCheatsheetComponent } from "angular2-hotkeys";
import { ModalInjectDirective, TreeviewComponent } from "multidirectory-ui-kit";
import { Subject, switchMap, takeUntil, tap } from "rxjs";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { WhoamiResponse } from "../../../models/whoami/whoami-response";
import { AppSettingsService } from "../../../services/app-settings.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CatalogContentComponent } from "../catalog-content/catalog-content.component";
import { SearchQueries } from "../../../core/ldap/search";
import { LdapWindowsService } from "../../../services/ldap-browser.service";
import { LdapEntityType } from "../../../core/ldap/ldap-entity-type";
import { LdapLoader } from "../../../core/ldap/ldap-loader";
import { EntityInfoResolver } from "../../../core/ldap/entity-info-resolver";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
    @ViewChild('properties') properties!: ModalInjectDirective;
    get tree(): LdapEntity[] {
        return <LdapEntity[]>this.navigation.ldapRoot!;
    }
    rootDse: LdapEntity[] = [];

    get user(): WhoamiResponse {
        return this.app.user;
    }
    showLeftPane = false;
    @ViewChild('treeView') treeView?: TreeviewComponent;
    @ViewChild('catalogContent') catalogContent?: CatalogContentComponent;
    @ViewChild('helpcheatSheet') helpcheatSheet!: HotkeysCheatsheetComponent;
    unsubscribe = new Subject<boolean>();
    constructor(
        private router: Router, 
        private navigation: LdapNavigationService,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef,
        private ldapWindows: LdapWindowsService,
        private app: AppSettingsService) {
        this.navigation.init();
        this.app.userRx.pipe(
            takeUntil(this.unsubscribe),
            tap(user => {
                 this.app.user = user;
                 console.log(user);
            }),
            switchMap(user => this.api.search(SearchQueries.findByName(user.display_name, undefined)))
        ).subscribe(userSearch => {
            const searchEntry =  userSearch.search_result[0];
            const displayName = LdapLoader.getSingleAttribute(searchEntry, 'name');
            const objectClass =  searchEntry.partial_attributes.find(x => x.type == 'objectClass');
            const entry = new LdapEntity({
                name: displayName,
                type: EntityInfoResolver.getNodeType(objectClass?.vals), 
                selectable: true,
                expandable: EntityInfoResolver.isExpandable(objectClass?.vals),
                entry: searchEntry,
                id: searchEntry.object_name,
            });
            this.app.userEntry = entry;
            this.app.user!.jpegPhoto = userSearch.search_result?.[0]?.partial_attributes?.find(x => x.type == 'photoBase64')?.vals?.[0] ?? undefined;
            this.cdr.detectChanges();
        });
        this.app.navigationalPanelVisibleRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.showLeftPane = x;
            this.catalogContent?.redraw();
        })
        
        this.ldapWindows.openEntityPropertiesModalRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.openEntityProperties(x);
        })
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    logout() {
        localStorage.clear();
        this.app.user = new WhoamiResponse({});
        this.router.navigate(['/login'])
    }

    helpMenuClick() {
        this.helpcheatSheet.toggleCheatSheet();
    }

    properitesEntity!: LdapEntity;
    openEntityProperties(entity: LdapEntity) {
        this.properitesEntity = entity;
        this.properties!.open({'width': '600px' });
    }
    openAccountSettings() {
        if(!this.app.userEntry) {
            return;
        }
        this.openEntityProperties(this.app.userEntry);
    }

    closeCheatsheet() {
        alert('test');
        this.helpcheatSheet.toggleCheatSheet();
    }
}