import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryUiKitModule, StepperComponent } from 'multidirectory-ui-kit';
import { DialogService } from '../../../services/dialog.service';
import { UserCreateService } from '@services/user-create.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject } from 'rxjs';
import {
  CreateUserDialogData,
  CreateUserDialogReturnData,
} from '../../../interfaces/user-create-dialog.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserCreateGeneralInfoComponent } from '@features/forms/user-create/general-info/general-info.component';
import { UserCreatePasswordSettingsComponent } from '@features/forms/user-create/password-settings/password-settings.component';
import { UserCreateSummaryComponent } from '@features/forms/user-create/summary/summary.component';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { CreateEntryResponse } from '@models/api/entry/create-response';
import { UserCreateRequest } from '@models/api/user-create/user-create.request';

@Component({
  selector: 'app-user-create-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    TranslocoPipe,
    MultidirectoryUiKitModule,
    UserCreateGeneralInfoComponent,
    UserCreatePasswordSettingsComponent,
    UserCreateSummaryComponent,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserDialogComponent implements OnInit {
  @ViewChild('createUserStepper', { static: true }) public stepper!: StepperComponent;
  @ViewChild('dialogComponent', { static: true }) public dialogComponent!: DialogComponent;

  public setupRequest = new UserCreateRequest();
  public unsubscribe = new Subject<void>();
  public formValid = false;

  private dialogRef: DialogRef<CreateUserDialogReturnData, CreateUserDialogComponent> =
    inject(DialogRef);
  private dialogService: DialogService = inject(DialogService);
  private setup: UserCreateService = inject(UserCreateService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private toastr: ToastrService = inject(ToastrService);
  private dialogData: CreateUserDialogData = inject(DIALOG_DATA);
  public parentDn = this.dialogData.dn;
  private destroyRef$: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.setup.onStepValid.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.formValid = x;
    });
  }

  close(data?: CreateEntryResponse) {
    this.dialogService.close(this.dialogRef, data);
  }

  nextStep() {
    if (!this.formValid) {
      this.setup.invalidate();
      this.toastr.error(translate('please-check-errors'));
      return;
    }
    this.stepper.next();
  }

  finish() {
    this.dialogComponent.showSpinner();

    this.api
      .create(
        new CreateEntryRequest({
          entry: `cn=${this.setupRequest.upnLogin},` + this.parentDn,
          attributes: [
            new LdapAttribute({
              type: 'objectClass',
              vals: [
                'user',
                'top',
                'person',
                'organizationalPerson',
                'posixAccount',
                'shadowAccount',
              ],
            }),
            new LdapAttribute({
              type: 'mail',
              vals: [this.setupRequest.email],
            }),
            new LdapAttribute({
              type: 'description',
              vals: [this.setupRequest.description],
            }),
            new LdapAttribute({
              type: 'sAMAccountName',
              vals: [this.setupRequest.upnLogin],
            }),
            new LdapAttribute({
              type: 'userAccountControl',
              vals: [this.setupRequest.uacBitSet.toString(10)],
            }),
            new LdapAttribute({
              type: 'userPrincipalName',
              vals: [this.setupRequest.upnLogin + '@' + this.setupRequest.upnDomain],
            }),
            new LdapAttribute({
              type: 'displayName',
              vals: [this.setupRequest.fullName],
            }),
            new LdapAttribute({
              type: 'givenName',
              vals: [this.setupRequest.firstName],
            }),
            new LdapAttribute({
              type: 'initials',
              vals: [this.setupRequest.initials],
            }),
            new LdapAttribute({
              type: 'surname',
              vals: [this.setupRequest.lastName],
            }),
          ],
          password: this.setupRequest.password,
        }),
      )
      .pipe(
        catchError((err) => {
          this.dialogComponent.hideSpinner();
          throw err;
        }),
      )
      .subscribe((x) => {
        this.dialogComponent.hideSpinner();
        this.close(x);
      });
  }
}
