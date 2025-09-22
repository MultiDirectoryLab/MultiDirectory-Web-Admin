import { NgClass } from '@angular/common';
import {
  Component,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { IpRange } from '@core/access-policy/access-policy-ip-address';
import { MfaAccessEnum } from '@core/access-policy/mfa-access-enum';
import { Constants } from '@core/constants';
import { SearchQueries } from '@core/ldap/search';
import { IpAddressValidatorDirective } from '@core/validators/ip-address.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { IpListDialogComponent } from 'projects/multidirectory-app/src/app/components/modals/components/dialogs/access-policy-ip-list/ip-list-dialog.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  DropdownComponent,
  DropdownOption,
  GroupComponent,
  MdFormComponent,
  MultiselectComponent,
  ShiftCheckboxComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { from, map, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DialogService } from '../../../../components/modals/services/dialog.service';
import { IplistDialogData } from '../../../../components/modals/interfaces/ip-list-dialog.interface';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { MaxLengthValidatorDirective } from '@core/validators/max-length.directive';

@Component({
  selector: 'app-access-policy-view',
  styleUrls: ['./access-policy-view.component.scss'],
  templateUrl: './access-policy-view.component.html',
  imports: [
    NgClass,
    MdFormComponent,
    TextboxComponent,
    ButtonComponent,
    MultiselectComponent,
    FormsModule,
    DropdownComponent,
    GroupComponent,
    ShiftCheckboxComponent,
    RequiredWithMessageDirective,
    IpAddressValidatorDirective,
    TranslocoPipe,
    MaxLengthValidatorDirective,
  ],
})
export class AccessPolicyViewComponent implements OnInit, OnDestroy {
  private dialog = inject(DialogService);
  private api = inject(MultidirectoryApiService);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private windows = inject(AppWindowsService);
  private ldapTreeview = inject(LdapTreeviewService);

  private _unsubscribe = new Subject<void>();
  readonly form = viewChild.required<MdFormComponent>('form');
  readonly groupSelector = viewChild.required<MultiselectComponent>('groupSelector');
  readonly mfaGroupSelector = viewChild<MultiselectComponent>('mfaGroupSelector');
  readonly showConrolButton = input(true);
  readonly accessClientChange = output<AccessPolicy>();
  readonly accessPolicyId = input<number>();
  ipAddresses = '';
  MfaAccessEnum = MfaAccessEnum;
  mfaAccess = MfaAccessEnum.Noone;
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
  selectedGroups: MultiselectModel[] = [];

  mfaGroupsQuery = '';
  availableMfaGroups: MultiselectModel[] = [];
  bypassAllowed = false;
  selectedMfaGroups: MultiselectModel[] = [];

  private _accessClient = new AccessPolicy();

  get accessClient(): AccessPolicy {
    return this._accessClient;
  }

  @Input() set accessClient(value: AccessPolicy) {
    this._accessClient = value;
    this.accessClientChange.emit(value);
  }

  ngOnInit(): void {
    this.load();

    this.api
      .getMultifactor()
      .pipe(take(1))
      .subscribe((mfSettings) => {
        this.bypassAllowed =
          !!mfSettings.mfa_key_ldap ||
          !!mfSettings.mfa_secret_ldap ||
          !!mfSettings.mfa_key ||
          !!mfSettings.mfa_secret;
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
        if (this.activatedRoute.snapshot.params.id) {
          this.accessClient =
            policies.find(
              (x) =>
                x.id == this.activatedRoute.snapshot.params.id || x.id == this.accessPolicyId(),
            ) ?? new AccessPolicy();
        }
        this.ipAddresses = this.accessClient.ipRange
          .map((x: any) => (x instanceof Object ? x.start + '-' + x.end : x))
          .join(', ');

        this.mfaAccess = this.accessClient.mfaStatus ?? MfaAccessEnum.Noone;
        this.selectedGroups = this.accessClient.groups.map((x) => this.getMultiselectOption(x));
        this.selectedMfaGroups = this.accessClient.mfaGroups.map((x) =>
          this.getMultiselectOption(x),
        );
      },
      error: () => {
        this.windows.hideSpinner();
      },
    });
  }

  close() {
    this.form()?.inputs.forEach((x) => x.reset());
    this.groupQuery = '';
    this.availableGroups = [];
  }

  flush() {
    this.accessClient.groups = this.selectedGroups.map((x) => x.id);
    this.accessClient.mfaStatus = this.mfaAccess;
    this.accessClient.mfaGroups = this.selectedMfaGroups.map((x) => x.id) ?? [];
  }

  save() {
    this.windows.showSpinner();
    this.flush();
    this.api.editAccessPolicy(this.accessClient).subscribe(() => {
      this.windows.hideSpinner();
    });
  }

  changeIpAdressAttribute() {
    this.dialog
      .open<IplistDialogData, IplistDialogData, IpListDialogComponent>({
        component: IpListDialogComponent,
        dialogConfig: {
          data: {
            addresses: this.accessClient.ipRange,
          },
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.ipAddresses = result.addresses
          .map((x: any) => (x instanceof Object ? x.start + '-' + x.end : x))
          .join(', ');
        this.accessClient.ipRange = result.addresses;
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

  checkGroups() {
    this.retrieveGroups(this.groupQuery)
      .pipe(take(1))
      .subscribe((result) => {
        this.availableGroups = result;
        this.groupSelector().showMenu();
      });
  }

  checkMfaGroups() {
    this.retrieveGroups(this.mfaGroupsQuery)
      .pipe(take(1))
      .subscribe((result) => {
        this.availableMfaGroups = result;
        this.mfaGroupSelector()?.showMenu();
      });
  }

  private getMultiselectOption(x: any) {
    const groupName = new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x;
    return new MultiselectModel({
      selected: true,
      id: x,
      title: groupName,
      badge_title: groupName,
    });
  }

  private retrieveGroups(groupQuery: string): Observable<MultiselectModel[]> {
    if (groupQuery.length < 2) {
      this.toastr.error(translate('errors.empty-filter'));
      return of([]);
    }
    return from(this.ldapTreeview.load('')).pipe(
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
}
