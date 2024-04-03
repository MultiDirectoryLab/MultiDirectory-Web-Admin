import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { AppWindowsService } from "../../../../services/app-windows.service";
import { Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { LdapEntryNode } from "../../../../core/ldap/ldap-entity";
import { AppSettingsService } from "../../../../services/app-settings.service";
import { ModalInjectDirective } from "ng-modal-full-resizable/lib/injectable/injectable.directive";

@Component({
    selector: 'app-windows',
    styleUrls: ['./windows.component.scss'],
    templateUrl: './windows.component.html'
})
export class WindowsComponent implements AfterViewInit {
    @ViewChild('createUserModal', { static: true}) createUserModal?: ModalInjectDirective;
    @ViewChild('createGroupModal', { static: true}) createGroupModal?: ModalInjectDirective;
    @ViewChild('createOuModal', { static: true}) createOuModal?: ModalInjectDirective;
    @ViewChild('properties') properties!: ModalInjectDirective;
    @ViewChild('changePasswordModal') changePasswordModal!: ModalInjectDirective
    private unsubscribe = new Subject<void>();

    constructor(private ldapWindows: AppWindowsService, private app: AppSettingsService) {}
    
    ngAfterViewInit(): void {
        this.ldapWindows.openEntityPropertiesModalRx.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x =>  this.openEntityProperties(x))
        ).subscribe(x => {
           this.ldapWindows.closeEntityPropertiesModal(x)
        });
        
        this.ldapWindows.openChangePasswordModalRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.openChangePassword(x);
        });


        this.ldapWindows.showCreateGroupMenuRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.openCreateGroup();
        })
    }
    
    openEntityProperties(entity: LdapEntryNode): Observable<LdapEntryNode> {
        return this.properties.open({'width': '600px', 'minHeight': 660 }, { "selectedEntity": entity }).pipe(take(1));
    }

    openAccountSettings() {
        if(!this.app.userEntry) {
            return;
        }
        this.openEntityProperties(this.app.userEntry);
    }

    openChangePassword(entity: LdapEntryNode | undefined = undefined) {
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

    openCreateUser() {
        this.createUserModal?.open({ 'width': '600px', 'minHeight': 485 }).pipe(take(1)).subscribe(() => {
            //this.loadData();
        });
    }

    openCreateGroup() {
        this.createGroupModal?.open({ 'width': '580px', 'minHeight': 485 }).pipe(take(1)).subscribe(() => {
            //this.loadData();
        });
    }

    openCreateOu() {
        this.createOuModal?.open({ 'width': '580px', 'minHeight': 485 }).pipe(take(1)).subscribe(x => {
            //this.loadData();
        });
    }

}