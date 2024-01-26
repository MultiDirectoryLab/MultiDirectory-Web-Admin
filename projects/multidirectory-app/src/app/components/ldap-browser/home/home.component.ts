import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HotkeysCheatsheetComponent } from "angular2-hotkeys";
import { ModalInjectDirective, TreeviewComponent } from "multidirectory-ui-kit";
import { Subject, combineLatest, switchMap, take, takeUntil, tap, zip } from "rxjs";
import { EntityInfoResolver } from "../../../core/ldap/entity-info-resolver";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { SearchQueries } from "../../../core/ldap/search";
import { WhoamiResponse } from "../../../models/whoami/whoami-response";
import { AppSettingsService } from "../../../services/app-settings.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { LdapWindowsService } from "../../../services/ldap-windows.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CatalogContentComponent } from "../catalog-content/catalog-content.component";
import { LdapTreeLoader } from "../../../core/navigation/node-loaders/ldap-node-loader/ldap-node-loader";

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
    @ViewChild('treeView') treeView?: TreeviewComponent;
    @ViewChild('catalogContent') catalogContent?: CatalogContentComponent;
    @ViewChild('helpcheatSheet') helpcheatSheet!: HotkeysCheatsheetComponent;
    unsubscribe = new Subject<boolean>();

    constructor(
        private navigation: LdapNavigationService,
        private ldapWindows: LdapWindowsService,
        private activatedRoute: ActivatedRoute,
        private app: AppSettingsService,
        private cdr: ChangeDetectorRef) {
        combineLatest([this.activatedRoute.queryParams, this.navigation.ldapRootRx]).pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            const dn = !!x[0].distinguishedName? x[0].distinguishedName : x[1][0].id;

            this.navigation.goTo(dn).then(x => {
                this.cdr.detectChanges();
            });
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