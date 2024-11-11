import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { translate } from '@jsverse/transloco';
import {
  DropdownOption,
  MdFormComponent,
  ModalInjectDirective,
  MultiselectComponent,
} from 'multidirectory-ui-kit';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { IpRange } from '@core/access-policy/access-policy-ip-address';
import { MfaAccessEnum } from '@core/access-policy/mfa-access-enum';
import { Constants } from '@core/constants';
import { SearchQueries } from '@core/ldap/search';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { AppNavigationService } from '@services/app-navigation.service';

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
  styleUrls: ['./access-policy-create.component.scss'],
})
export class AccessPolicyCreateComponent implements OnInit {
  @ViewChild('ipListEditor', { static: true }) ipListEditor!: ModalInjectDirective;
  @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
  @ViewChild('groupSelector', { static: true }) groupSelector!: MultiselectComponent;
  @ViewChild('mfaGroupSelector') mfaGroupSelector!: MultiselectComponent;

  accessClient = new AccessPolicy();
  ipAddresses = '';
  MfaAccessEnum = MfaAccessEnum;
  mfaAccess = MfaAccessEnum.SelectedGroups;
  options: DropdownOption[] = [
    { title: translate('access-policy-create.everyone'), value: MfaAccessEnum.Everyone },
    { title: translate('access-policy-create.noone'), value: MfaAccessEnum.Noone },
    {
      title: translate('access-policy-create.selectedgroups'),
      value: MfaAccessEnum.SelectedGroups,
    },
  ];
  groupQuery = '';
  availableGroups: MultiselectModel[] = [];

  mfaGroupsQuery = '';
  availableMfaGroups: MultiselectModel[] = [];

  constructor(
    private api: MultidirectoryApiService,
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
    private navigation: AppNavigationService,
  ) {}
  ngOnInit(): void {
    this.accessClient = this.modalControl.contentOptions!.accessPolicy;

    this.ipAddresses = this.accessClient.ipRange
      .map((x: any) => (x instanceof Object ? x.start + '-' + x.end : x))
      .join(', ');

    this.mfaAccess = this.accessClient.mfaStatus ?? MfaAccessEnum.Noone;
    this.availableGroups = this.accessClient.groups.map(
      (x) =>
        new MultiselectModel({
          selected: true,
          id: x,
          title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x,
          badge_title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x,
        }),
    );

    this.availableMfaGroups = this.accessClient.mfaGroups.map(
      (x) =>
        new MultiselectModel({
          selected: true,
          id: x,
          title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x,
          badge_title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x,
        }),
    );
  }

  close() {
    this.form?.inputs.forEach((x) => x.reset());
    this.groupQuery = '';
    this.availableGroups = [];
    this.modalControl.close(null);
  }

  save() {
    this.accessClient.groups = this.groupSelector.selectedData.map((x) => x.title);
    this.accessClient.mfaStatus = this.mfaAccess;
    this.accessClient.mfaGroups = this.mfaGroupSelector?.selectedData.map((x) => x.title) ?? [];
    this.modalControl.close(this.accessClient);
  }

  changeIpAdressAttribute() {
    const closeRx = this.ipListEditor!.open(
      { zIndex: 99 },
      { ipAddresses: this.accessClient.ipRange },
    );
    closeRx.pipe(take(1)).subscribe((result) => {
      if (!result) {
        return;
      }
      this.ipAddresses = result
        .map((x: any) => (x instanceof Object ? x.start + '-' + x.end : x))
        .join(', ');
      this.accessClient.ipRange = this.accessClient.ipRange = result;
    });
  }

  onIpChanged() {
    this.accessClient.ipRange = this.accessClient.ipRange = this.ipAddresses.split(',').map((x) => {
      x = x.trim();
      if (x.includes('-')) {
        const parts = x.split('-').map((x) => x.trim());
        return new IpRange({
          start: parts[0],
          end: parts[1],
        });
      }
      return x.trim();
    });
  }

  private retrieveGroups(groupQuery: string): Observable<MultiselectModel[]> {
    if (groupQuery.length < 2) {
      return of([]);
    }
    return this.navigation.getRoot().pipe(
      take(1),
      switchMap((root) =>
        this.api.search(SearchQueries.findEntities(groupQuery, root?.[0]?.id ?? '', ['group'])),
      ),
      map((result) => {
        return result.search_result.map((x) => {
          const name = new RegExp(Constants.RegexGetNameFromDn).exec(x.object_name);
          return new MultiselectModel({
            id: x.object_name,
            selected: false,
            title: name?.[1],
            badge_title: name?.[1] ?? x.object_name,
          });
        });
      }),
    );
  }

  checkGroups() {
    this.retrieveGroups(this.groupQuery)
      .pipe(take(1))
      .subscribe((result) => {
        this.availableGroups = result;
        this.groupSelector.showMenu();
      });
  }
  checkMfaGroups() {
    this.retrieveGroups(this.mfaGroupsQuery)
      .pipe(take(1))
      .subscribe((result) => {
        this.availableMfaGroups = result;
        this.mfaGroupSelector.showMenu();
      });
  }
}
