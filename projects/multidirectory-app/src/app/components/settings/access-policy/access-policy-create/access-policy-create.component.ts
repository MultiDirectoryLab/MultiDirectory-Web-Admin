import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { DropdownOption, MdFormComponent, ModalInjectDirective, MultiselectComponent } from "multidirectory-ui-kit";
import { AccessPolicy } from "projects/multidirectory-app/src/app/core/access-policy/access-policy";
import { IpRange } from "projects/multidirectory-app/src/app/core/access-policy/access-policy-ip-address";
import { MfaAccessEnum } from "projects/multidirectory-app/src/app/core/access-policy/mfa-access-enum";
import { Constants } from "projects/multidirectory-app/src/app/core/constants";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { take } from "rxjs";

export class MultiselectModel {
    id: string = '';
    title: string = '';
    badge_title?: string;
    selected = false;
    key = '';

    constructor(obj: Partial<MultiselectModel>) {
        Object.assign(this, obj);
    }
}

@Component({
    selector: 'app-access-policy-create',
    templateUrl: './access-policy-create.component.html',
    styleUrls: ['./access-policy-create.component.scss']
})
export class AccessPolicyCreateComponent implements OnInit {
    @ViewChild('ipListEditor', { static: true }) ipListEditor!: ModalInjectDirective;
    @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
    @ViewChild('groupSelector', {static: true}) groupSelector!: MultiselectComponent;
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
    constructor(private api: MultidirectoryApiService, @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {}
    ngOnInit(): void {
    
        this.accessClient = this.modalControl.contentOptions!.accessPolicy;
        
        this.ipAddresses = this.accessClient.ipRange.join(', ');

        this.mfaAccess = MfaAccessEnum.Everyone;
        this.availableGroups = this.accessClient.groups.map(x => new MultiselectModel({
            selected: true,
            id: x,
            title: x,
            badge_title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x
        }));
    }

    close() {
        this.form?.inputs.forEach(x => x.reset());
        this.groupQuery = '';
        this.availableGroups = [];
        this.modalControl.close(null);
    }

    save() {
        this.accessClient.groups = this.groupSelector.selectedData.map(x => x.title);
        this.modalControl.close(this.accessClient);
    }

    changeIpAdressAttribute( ) {
        const closeRx = this.ipListEditor!.open({ 'zIndex': 99 }, { ipAddresses: this.accessClient.ipRange });
        closeRx.pipe(take(1)).subscribe(result => {
            if(!result) {
                return;
            }
            this.ipAddresses = result.join(', ');
            this.accessClient.ipRange = result;
        });
    }

    onIpChanged() {
        this.accessClient.ipRange = this.ipAddresses.split(',').map(x => {
            if(x.includes('-')) {
                const parts = x.split('-');
                return new IpRange({
                    start: parts[0],
                    end: parts[1]
                });
            }
            return x.trim()
        });
    }

    checkGroups() {
        this.api.search(SearchQueries.findGroup(this.groupQuery, '', [])).subscribe(result => {
            this.availableGroups = result.search_result.map(x => {
                const name = new RegExp(Constants.RegexGetNameFromDn).exec(x.object_name);
                return new MultiselectModel({
                    id: x.object_name,
                    selected: false,
                    title: x.object_name,
                    badge_title: name?.[1] ?? x.object_name
                });
            });
            this.groupSelector.showMenu();
        })
    }
}