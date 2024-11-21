import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { Observable, Subject, map, of, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppWindowsService } from '@services/app-windows.service';
import { AppNavigationService } from '@services/app-navigation.service';
import { ToastrService } from 'ngx-toastr';
import { MultiselectModel } from './multiselect-model';

@Component({
  selector: 'app-access-policy-view',
  styleUrls: ['./access-policy-view.component.scss'],
  templateUrl: './access-policy-view.component.html',
})
export class AccessPolicyViewComponent implements OnInit, OnDestroy {
  @ViewChild('ipListEditor', { static: true }) ipListEditor!: ModalInjectDirective;
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  @ViewChild('groupSelector', { static: true }) groupSelector!: MultiselectComponent;
  @ViewChild('mfaGroupSelector') mfaGroupSelector!: MultiselectComponent;
  @Input() showConrolButton = true;
  private _accessClient = new AccessPolicy();
  private _unsubscribe = new Subject<void>();
  get accessClient(): AccessPolicy {
    return this._accessClient;
  }
  @Input() set accessClient(value: AccessPolicy) {
    this._accessClient = value;
    this.accessClientChange.emit(value);
  }
  @Output() accessClientChange = new EventEmitter<AccessPolicy>();
  @Input() accessPolicyId: number | undefined;

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
    private navigation: AppNavigationService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private windows: AppWindowsService,
  ) {}

  private getMultiselectOption(x: any) {
    const groupName = new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x;
    return new MultiselectModel({
      selected: true,
      id: x,
      title: groupName,
      badge_title: groupName,
    });
  }

  ngOnInit(): void {
    this.navigation.navigationRx.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.load();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  load() {
    this.windows.showSpinner();
    this.api.getAccessPolicy().subscribe({
      next: (policies) => {
        this.windows.hideSpinner();
        this.accessClient =
          policies.find(
            (x) => x.id == this.activatedRoute.snapshot.params.id || x.id == this.accessPolicyId,
          ) ?? new AccessPolicy();
        this.ipAddresses = this.accessClient.ipRange
          .map((x: any) => (x instanceof Object ? x.start + '-' + x.end : x))
          .join(', ');

        this.mfaAccess = this.accessClient.mfaStatus ?? MfaAccessEnum.Noone;
        this.availableGroups = this.accessClient.groups.map((x) => this.getMultiselectOption(x));

        this.availableMfaGroups = this.accessClient.mfaGroups.map((x) =>
          this.getMultiselectOption(x),
        );
      },
      error: () => {
        this.windows.hideSpinner();
      },
    });
  }

  close() {
    this.form?.inputs.forEach((x) => x.reset());
    this.groupQuery = '';
    this.availableGroups = [];
  }

  flush() {
    this.accessClient.groups = this.groupSelector.selectedData.map((x) => x.id);
    this.accessClient.mfaStatus = this.mfaAccess;
    this.accessClient.mfaGroups = this.mfaGroupSelector?.selectedData.map((x) => x.id) ?? [];
  }

  save() {
    this.windows.showSpinner();
    this.flush();
    this.api.editAccessPolicy(this.accessClient).subscribe((x) => {
      this.windows.hideSpinner();
    });
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
      this.toastr.error(translate('errors.empty-filter'));
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
