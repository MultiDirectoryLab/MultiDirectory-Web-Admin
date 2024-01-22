import { Component, Inject, ViewChild } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { MdFormComponent, MultiselectComponent, DropdownOption } from "multidirectory-ui-kit";
import { ModalInjectDirective } from "ng-modal-full-resizable/lib/injectable/injectable.directive";
import { AccessPolicy } from "projects/multidirectory-app/src/app/core/access-policy/access-policy";
import { IpRange } from "projects/multidirectory-app/src/app/core/access-policy/access-policy-ip-address";
import { MfaAccessEnum } from "projects/multidirectory-app/src/app/core/access-policy/mfa-access-enum";
import { Constants } from "projects/multidirectory-app/src/app/core/constants";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { take, Observable, map } from "rxjs";
import { MultiselectModel } from "../access-policy-create/access-policy-create.component";

@Component({
    selector: 'app-access-policy-view',
    styleUrls: ['./access-policy-view.component.scss'],
    templateUrl: './access-policy-view.component.html'
})
export class AccessPolicyViewComponent {
    accessClient = new AccessPolicy();
    @ViewChild('ipListEditor', { static: true }) ipListEditor!: ModalInjectDirective;
    @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
    @ViewChild('groupSelector', {static: true}) groupSelector!: MultiselectComponent;
    @ViewChild('mfaGroupSelector') mfaGroupSelector!: MultiselectComponent;

    ipAddresses = '';
    MfaAccessEnum = MfaAccessEnum;
    mfaAccess = MfaAccessEnum.SelectedGroups;
    options: DropdownOption[] = [ 
        { title: translate('access-policy-create.everyone'), value: MfaAccessEnum.Everyone },
        { title: translate('access-policy-create.noone'), value: MfaAccessEnum.Noone },
        { title: translate('access-policy-create.selectedgroups'), value: MfaAccessEnum.SelectedGroups }
    ];
    groupQuery = '';
    availableGroups: MultiselectModel[] = [];

    mfaGroupsQuery = '';
    availableMfaGroups: MultiselectModel[] = [];

    constructor(private api: MultidirectoryApiService) {}
    ngOnInit(): void {
    
        //this.accessClient = this.modalControl.contentOptions!.accessPolicy;
        
        this.ipAddresses = this.accessClient.ipRange.map((x: any) => x instanceof Object? x.start + '-' + x.end : x).join(', ');

        this.mfaAccess = this.accessClient.mfaStatus ?? MfaAccessEnum.Noone;
        this.availableGroups = this.accessClient.groups.map(x => new MultiselectModel({
            selected: true,
            id: x,
            title: x,
            badge_title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x
        }));

        this.availableMfaGroups = this.accessClient.mfaGroups.map(x => new MultiselectModel({
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
    }

    save() {
        this.accessClient.groups = this.groupSelector.selectedData.map(x => x.title);
        this.accessClient.mfaStatus  = this.mfaAccess;
        this.accessClient.mfaGroups = this.mfaGroupSelector?.selectedData.map(x => x.title) ?? [];
    }

    changeIpAdressAttribute( ) {
        const closeRx = this.ipListEditor!.open({ 'zIndex': 99 }, { ipAddresses: this.accessClient.ipRange });
        closeRx.pipe(take(1)).subscribe(result => {
            if(!result) {
                return;
            }
            this.ipAddresses = result.map((x: any) => x instanceof Object? x.start + '-' + x.end : x).join(', ');
            this.accessClient.ipRange = this.accessClient.ipRange = result;
        });
    }

    onIpChanged() {
        this.accessClient.ipRange = this.accessClient.ipRange = this.ipAddresses.split(',').map(x => {
            x = x.trim()
            if(x.includes('-')) {
                const parts = x.split('-').map(x => x.trim());
                return new IpRange({
                    start: parts[0],
                    end: parts[1]
                });
            }
            return x.trim()
        });
    }

    retrieveGroups(groupQuery: string): Observable<MultiselectModel[]> {
        return this.api.search(SearchQueries.findGroup(groupQuery, '', [])).pipe(map(result => {
            return result.search_result.map(x => {
                const name = new RegExp(Constants.RegexGetNameFromDn).exec(x.object_name);
                return new MultiselectModel({
                    id: x.object_name,
                    selected: false,
                    title: x.object_name,
                    badge_title: name?.[1] ?? x.object_name
                });
            })
        }));
    }

    checkGroups() {
        this.retrieveGroups(this.groupQuery).pipe(take(1)).subscribe(result => {
            this.availableGroups = result; 
            this.groupSelector.showMenu()
        });
    }
    checkMfaGroups() {
        this.retrieveGroups(this.mfaGroupsQuery).pipe(take(1)).subscribe(result => {
            this.availableMfaGroups = result; 
            this.mfaGroupSelector.showMenu()
        });
    }
}