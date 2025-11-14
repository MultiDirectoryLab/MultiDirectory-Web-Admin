import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
  EntitySelectorSettings,
} from '@components/modals/interfaces/entity-selector-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { MaxValueValidatorDirective } from '@core/validators/max-value.directive';
import { MinValueValidatorDirective } from '@core/validators/min-value.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { EntitySelectorDialogComponent } from '@features/entity-selector/entity-selector-dialog/entity-selector-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DropdownOption, MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';
import { catchError, filter, finalize, from, switchMap } from 'rxjs';

export const DialogType = {
  Create: 'create',
  Change: 'change',
} as const;
export type DialogType = (typeof DialogType)[keyof typeof DialogType];

type DialogSettings = {
  submitCallback: (event: SubmitEvent) => void;
  translocoKey: string;
};

@Component({
  selector: 'app-password-policy',
  imports: [
    TranslocoPipe,
    RequiredWithMessageDirective,
    FormsModule,
    MultidirectoryUiKitModule,
    MinValueValidatorDirective,
    MaxValueValidatorDirective,
    FaIconComponent,
    RouterLink,
  ],
  templateUrl: './password-policy.component.html',
})
export class PasswordPolicyComponent implements OnInit {
  private readonly form = viewChild.required<MdFormComponent>('form');

  protected readonly faEllipsisH = faEllipsisH;

  protected forbiddenPasswords?: File;
  protected dialogType: WritableSignal<DialogType> = signal(DialogType.Create);
  protected passwordPolicy: WritableSignal<PasswordPolicy> = signal(new PasswordPolicy());
  protected languageOptions: DropdownOption[] = ['Latin', 'Cyrillic'].map(
    (x) => new DropdownOption({ title: x, value: x }),
  );
  protected scopeOptions: DropdownOption[] = [];

  protected readonly isDefaultPolicy = computed(
    () => this.passwordPolicy().name === Constants.DefaultPolicyName,
  );

  protected readonly dialogTypes = DialogType;

  private readonly windows = inject(AppWindowsService);
  private readonly api = inject(MultidirectoryApiService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly treeView = inject(LdapTreeviewService);

  ngOnInit(): void {
    this.loadPolicyFromRoute();
  }

  protected change(event: SubmitEvent) {
    this.stopSubmitEvent(event);
    this.form().validate();

    if (this.form().valid) {
      this.windows.showSpinner();

      this.api
        .savePasswordPolicy(this.passwordPolicy())
        .pipe(
          finalize(() => {
            this.windows.hideSpinner();
            this.router.navigate(['policies/password-policies']);
          }),
          catchError((err) => {
            this.windows.hideSpinner();
            this.toastr.error(translate('password-policy.policy-update-error'));
            throw err;
          }),
        )
        .subscribe(() =>
          this.toastr.success(translate('password-policy.policy-updated-successfully')),
        );
    }
  }

  protected showGroupDialog() {
    from(this.treeView.load(''))
      .pipe(
        switchMap((tree) => {
          return this.dialogService.open<
            EntitySelectorDialogReturnData,
            EntitySelectorDialogData,
            EntitySelectorDialogComponent
          >({
            component: EntitySelectorDialogComponent,
            dialogConfig: {
              minHeight: '360px',
              data: new EntitySelectorSettings({
                selectedEntities: this.passwordPolicy().scopes.map(
                  (scope) =>
                    new MultiselectModel({
                      id: scope,
                      selected: true,
                      title: scope,
                      badge_title: scope,
                    }),
                ),
                selectedEntityTypes: ENTITY_TYPES.filter((x) => x.id === 'Groups') ?? [],
                allowSelectEntityTypes: false,
                selectedPlaceDn: tree[0].id,
              }),
            },
          }).closed;
        }),
        filter(Boolean),
      )
      .subscribe((res: EntitySelectorDialogReturnData) =>
        this.passwordPolicy.update((prev) => {
          prev.scopes = res.map((x) => x.id);
          return prev;
        }),
      );
  }

  private loadPasswordPolicy(id: string) {
    this.windows.showSpinner();

    this.api
      .getPasswordPolicy(id)
      .pipe(
        finalize(() => this.windows.hideSpinner()),
        catchError((err) => {
          this.windows.hideSpinner();
          this.toastr.error(translate('password-policy.policy-load-error'));
          throw err;
        }),
      )
      .subscribe((policy) => {
        this.passwordPolicy.set(policy);
        this.scopeOptions = policy.scopes.map((x) => new DropdownOption({ title: x, value: x }));
      });
  }

  private stopSubmitEvent(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  private loadPolicyFromRoute() {
    const id: string | undefined = this.activatedRoute.snapshot.params['id'];

    if (id && id.trim() !== '') {
      this.loadPasswordPolicy(id);
    }
  }
}
