import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HotkeysCheatsheetComponent } from "angular2-hotkeys";
import { ModalInjectDirective, TreeviewComponent } from "multidirectory-ui-kit";
import { Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { EntityInfoResolver } from "../../../core/ldap/entity-info-resolver";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { SearchQueries } from "../../../core/ldap/search";
import { WhoamiResponse } from "../../../models/whoami/whoami-response";
import { AppSettingsService } from "../../../services/app-settings.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { LdapWindowsService } from "../../../services/ldap-windows.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CatalogContentComponent } from "../catalog-content/catalog-content.component";
import { LdapTreeLoader } from "../../../core/navigation/node-loaders/ldap-tree-loader/ldap-tree-loader";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    @ViewChild('properties') properties!: ModalInjectDirective;
    @ViewChild('changePasswordModal') changePasswordModal?: ModalInjectDirective
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
        private activatedRoute: ActivatedRoute,
        private navigation: LdapNavigationService,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef,
        private ldapWindows: LdapWindowsService,
        private app: AppSettingsService) {
        this.app.userRx.pipe(
            takeUntil(this.unsubscribe),
            tap(user => {
                 this.app.user = user;
            }),
            switchMap(user => this.api.search(SearchQueries.findByName(user.display_name, undefined)))
        ).subscribe(userSearch => {
            const searchEntry =  userSearch.search_result[0];
            const displayName = LdapTreeLoader.getSingleAttribute(searchEntry, 'name');
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
        });
        
        this.ldapWindows.openChangePasswordModalRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.openChangePassword(x);
        })
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    helpMenuClick() {
        this.helpcheatSheet.toggleCheatSheet();
    }

    openEntityProperties(entity: LdapEntity) {
        this.properties!.open({'width': '600px', 'minHeight': 660 }, { "selectedEntity": entity }).pipe(take(1)).subscribe(x => {
            this.navigation.setCatalog(this.navigation.selectedCatalog, this.navigation.page, [entity]);
        });
    }

    openAccountSettings() {
        if(!this.app.userEntry) {
            return;
        }
        this.openEntityProperties(this.app.userEntry);
    }

    openChangePassword(entity: LdapEntity | undefined = undefined) {
        if(!entity) {
            if(!this.app.userEntry) {
                return;
            }
            entity = this.app.userEntry;
        }
        this.changePasswordModal?.open(undefined, { 
            identity: entity.id, 
            un: entity.name 
        }).pipe(take(1)).subscribe(x => {
        });
    }

    closeCheatsheet() {
        this.helpcheatSheet.toggleCheatSheet();
    }
}