import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { AppWindowsService } from "@services/app-windows.service";
import { Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { LdapEntryNode } from "@core/ldap/ldap-entity";
import { AppSettingsService } from "@services/app-settings.service";
import { ModalInjectDirective } from "ng-modal-full-resizable/lib/injectable/injectable.directive";

@Component({
    selector: 'app-windows',
    styleUrls: ['./windows.component.scss'],
    templateUrl: './windows.component.html'
})
export class WindowsComponent implements AfterViewInit {
    @ViewChild('createUserModal', { static: true}) createUserModal!: ModalInjectDirective;
    @ViewChild('createGroupModal', { static: true}) createGroupModal!: ModalInjectDirective;
    @ViewChild('createOuModal', { static: true}) createOuModal!: ModalInjectDirective;
    @ViewChild('createComputerModal', { static: true}) createComputerModal!: ModalInjectDirective;
    @ViewChild('properties') properties!: ModalInjectDirective;
    @ViewChild('changePasswordModal') changePasswordModal!: ModalInjectDirective;
    @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ModalInjectDirective;
    @ViewChild('modifyDnModal') modifyDnModal!: ModalInjectDirective;
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

        this.ldapWindows.showCreateUserMenuRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(parentDn => {
            this.openCreateUser(parentDn);
        });

        this.ldapWindows.showCreateGroupMenuRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(parentDn => {
            this.openCreateGroup(parentDn);
        });

        this.ldapWindows.showCreateOuMenuRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(parentDn => {
            this.openCreateOu(parentDn);
        });

        this.ldapWindows.showCreateComputerMenuRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(parentDn => {
            this.openCreateComputer(parentDn);
        });

        this.ldapWindows.showDeleteEntryConfirmationRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(toDeleteDNs => {
            this.openDeleteRowsConfirmation(toDeleteDNs);
        })

        this.ldapWindows.showModifyDnRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(toModifyDn => {
            this.openModifyDn(toModifyDn);
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

    openCreateUser(parentDn: string) {
        this.createUserModal.open({ 'width': '580px', 'minHeight': 485 }, { 'parentDn': parentDn }).pipe(
            take(1)
        ).subscribe(x => {
            this.ldapWindows.closeCreateUser(parentDn);
        });
    }

    openCreateGroup(parentDn: string) {
        this.createGroupModal.open({ 'width': '580px', 'minHeight': 485 }, { 'parentDn': parentDn }).pipe(
            take(1)
        ).subscribe(x => {
            this.ldapWindows.closeCreateGroup(parentDn);
        });
    }

    openCreateOu(parentDn: string) {
        this.createOuModal.open({ 'width': '580px', 'minHeight': 485 }, { 'parentDn': parentDn }).pipe(
            take(1)
        ).subscribe(x => {
            this.ldapWindows.closeCreateOu(parentDn);
        });
    }

    openCreateComputer(parentDn: string) {
        this.createComputerModal.open({ 'width': '580px', 'minHeight': 525 }, { 'parentDn': parentDn }).pipe(
            take(1)
        ).subscribe(x => {
            this.ldapWindows.closeCreateComputer(x);
        });
    }


    openDeleteRowsConfirmation(toDeleteDNs: string[]) {
        this.deleteConfirmationModal.open({'width': '580px'}, { "toDeleteDNs": toDeleteDNs }).pipe(
            take(1)
        ).subscribe(x => {
            this.ldapWindows.closeDeleteEntryConfirmation(x)
        })
    }
    
    openModifyDn(toModifyDn: string) {
        this.modifyDnModal.open({'width': '580px'}, { "toModifyDn": toModifyDn }).pipe(
            take(1)
        ).subscribe(x => {
            this.ldapWindows.closeModifyDn(x)
        })
    }
}