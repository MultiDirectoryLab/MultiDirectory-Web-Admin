import { Component, EventEmitter, ViewChild } from "@angular/core";
import { DropdownOption, MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import { AccessControlClient } from "../../../core/access-control/access-control";
import { Observable, take } from "rxjs";
import { MfaAccessEnum } from "../../../core/access-control/mfa-access-enum";
import { AccessGroupSelectorComponent } from "../access-control-group-selector/access-group-selector.component";
import { AttributeListComponent } from "../../ldap-browser/editors/attributes-list/attributes-list.component";

@Component({
    selector: 'app-access-control-client-create',
    templateUrl: './access-control-client-create.component.html',
    styleUrls: ['./access-control-client-create.component.scss']
})
export class AccessControlClientCreateComponent {
    @ViewChild('accessControlCreateModal') modal!: MdModalComponent;
    @ViewChild('attributeList', { static: true }) attributeList: AttributeListComponent | null = null;
    @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
    @ViewChild('groupSelector', {static: true}) groupSelector!: AccessGroupSelectorComponent;
    accessClient = new AccessControlClient();
    ipAddresses = '';
    groups = '';
    mfaAccess = MfaAccessEnum.SelectedGroups;
    options: DropdownOption[] = [ 
        { title: 'Всем', value: MfaAccessEnum.Everyone },
        { title: 'Никому', value: MfaAccessEnum.Noone },
        { title: 'Выбранным группам', value: MfaAccessEnum.SelectedGroups }
    ];

    onSave = new EventEmitter<AccessControlClient | null>();

    open(client: AccessControlClient): Observable<AccessControlClient | null> {
        this.accessClient = client;
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