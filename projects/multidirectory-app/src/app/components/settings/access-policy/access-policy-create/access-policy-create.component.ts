import { Component, EventEmitter, ViewChild } from "@angular/core";
import { Observable, take } from "rxjs";
import { MdModalComponent, MdFormComponent, DropdownOption } from "multidirectory-ui-kit";
import { MfaAccessEnum } from "projects/multidirectory-app/src/app/core/access-policy/mfa-access-enum";
import { AttributeListComponent } from "../../../ldap-browser/editors/attributes-list/attributes-list.component";
import { AccessPolicy } from "projects/multidirectory-app/src/app/core/access-policy/access-policy";
import { AccessGroupSelectorComponent } from "../access-policy-group-selector/access-group-selector.component";

@Component({
    selector: 'app-access-policy-create',
    templateUrl: './access-policy-create.component.html',
    styleUrls: ['./access-policy-create.component.scss']
})
export class AccessPolicyCreateComponent {
    @ViewChild('accessControlCreateModal') modal!: MdModalComponent;
    @ViewChild('attributeList', { static: true }) attributeList: AttributeListComponent | null = null;
    @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
    @ViewChild('groupSelector', {static: true}) groupSelector!: AccessGroupSelectorComponent;
    accessClient = new AccessPolicy();
    ipAddresses = '';
    groups = '';
    mfaAccess = MfaAccessEnum.SelectedGroups;
    options: DropdownOption[] = [ 
        { title: 'Всем', value: MfaAccessEnum.Everyone },
        { title: 'Никому', value: MfaAccessEnum.Noone },
        { title: 'Выбранным группам', value: MfaAccessEnum.SelectedGroups }
    ];

    onSave = new EventEmitter<AccessPolicy | null>();

    open(client: AccessPolicy): Observable<AccessPolicy | null> {
        this.accessClient = client;
        console.log(client);
        this.modal.open();
        this.ipAddresses = this.accessClient.ipRange.join(', ');
        this.groups = this.accessClient.groups.map(x => x.name).join(', ');
        this.mfaAccess = MfaAccessEnum.Everyone;
        return this.onSave.asObservable();
    }

    close() {
        this.form?.inputs.forEach(x => x.reset());
        this.onSave.emit(null);
        this.modal.close();
    }

    save() {
        console.log(this.accessClient);
        this.onSave.emit(this.accessClient);
        this.modal.close();
        this.form?.inputs.forEach(x => x.reset());
    }

    changeIpAdressAttribute( ) {
        const closeRx = this.attributeList!.open('Допустимые адреса', 'IpRange', this.accessClient.ipRange);
        closeRx.pipe(take(1)).subscribe(result => {
            if(!result) {
                return;
            }
            this.accessClient.ipRange = result;
            this.ipAddresses = result.join(', ');
        });
    }

    onIpChanged() {
        this.accessClient.ipRange = this.ipAddresses.split(',').map(x => x.trim());
    }

    changeGroupSelection() {
        const closeRx = this.groupSelector!.open();
        closeRx.pipe(take(1)).subscribe(result => {
            if(!result) {
                return;
            }
            this.accessClient.groups = result;
            this.groups = this.accessClient.groups.map(x => x.name).join(', ');
        });
    }
}