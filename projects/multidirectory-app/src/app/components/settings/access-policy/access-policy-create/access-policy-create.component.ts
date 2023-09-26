import { Component, EventEmitter, Query, ViewChild } from "@angular/core";
import { Observable, take } from "rxjs";
import { MdModalComponent, MdFormComponent, DropdownOption } from "multidirectory-ui-kit";
import { MfaAccessEnum } from "projects/multidirectory-app/src/app/core/access-policy/mfa-access-enum";
import { AttributeListComponent } from "../../../ldap-browser/editors/attributes-list/attributes-list.component";
import { AccessPolicy } from "projects/multidirectory-app/src/app/core/access-policy/access-policy";
import { GroupSelectorComponent } from "../../../forms/group-selector/group-selector.component";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { MultiselectModel } from "projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model";

@Component({
    selector: 'app-access-policy-create',
    templateUrl: './access-policy-create.component.html',
    styleUrls: ['./access-policy-create.component.scss']
})
export class AccessPolicyCreateComponent {
    @ViewChild('accessControlCreateModal') modal!: MdModalComponent;
    @ViewChild('attributeList', { static: true }) attributeList: AttributeListComponent | null = null;
    @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
    @ViewChild('groupSelector', {static: true}) groupSelector!: GroupSelectorComponent;
    accessClient = new AccessPolicy();
    ipAddresses = '';
    mfaAccess = MfaAccessEnum.SelectedGroups;
    options: DropdownOption[] = [ 
        { title: 'Всем', value: MfaAccessEnum.Everyone },
        { title: 'Никому', value: MfaAccessEnum.Noone },
        { title: 'Выбранным группам', value: MfaAccessEnum.SelectedGroups }
    ];
    groupQuery = '';
    availableGroups: MultiselectModel[] = [];
    constructor(private api: MultidirectoryApiService) {}
    onSave = new EventEmitter<AccessPolicy | null>();

    open(client: AccessPolicy): Observable<AccessPolicy | null> {
        this.accessClient = client;
        this.modal.open();
        this.ipAddresses = this.accessClient.ipRange.join(', ');
        this.mfaAccess = MfaAccessEnum.Everyone;
        this.availableGroups = this.accessClient.groups.map(x => new MultiselectModel({
            selected: true,
            id: x,
            title: x
        }))
        return this.onSave.asObservable();
    }

    close() {
        this.form?.inputs.forEach(x => x.reset());
        this.groupQuery = '';
        this.availableGroups = [];
        this.onSave.emit(null);
        this.modal.close();
    }

    save() {
        this.accessClient.groups = this.availableGroups.filter(x => x.selected).map(x => x.title);
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
            this.accessClient.groups = result.map(x => x.title);
        });
    }

    checkGroups() {
        this.api.search(SearchQueries.findGroup(this.groupQuery, '', [])).subscribe(result => {
            this.availableGroups = this.availableGroups.filter(x => x.selected).concat(result.search_result.map(x => new MultiselectModel({
                id: x.object_name,
                selected: false,
                title: x.object_name
            })));
        })
    }
}