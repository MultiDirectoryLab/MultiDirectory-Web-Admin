import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { UserCreateGeneralInfoComponent } from '@features/forms/user-create/general-info/general-info.component';
import { UserCreatePasswordSettingsComponent } from '@features/forms/user-create/password-settings/password-settings.component';
import { UserCreateSummaryComponent } from '@features/forms/user-create/summary/summary.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { CreateEntryRequest } from '@models/entry/create-request';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { UserCreateService } from '@services/user-create.service';
import BitSet from 'bitset';
import {
  ButtonComponent,
  ModalInjectDirective,
  StepDirective,
  StepperComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  imports: [
    TranslocoPipe,
    StepperComponent,
    UserCreateGeneralInfoComponent,
    UserCreatePasswordSettingsComponent,
    UserCreateSummaryComponent,
    ButtonComponent,
    StepDirective,
  ],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  @Output() onCreate = new EventEmitter<void>();
  @ViewChild('createUserStepper') stepper!: StepperComponent;
  setupRequest = new UserCreateRequest();
  unsubscribe = new Subject<void>();
  formValid = false;
  parentDn = '';
  uacBitSet?: BitSet;

  constructor(
    private setup: UserCreateService,
    private api: MultidirectoryApiService,
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.setup.onStepValid.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });

    this.parentDn = this.modalControl.contentOptions?.['parentDn'] ?? '';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onFinish() {
    this.modalControl.showSpinner();

    this.api
      .create(
        new CreateEntryRequest({
          entry: `cn=${this.setupRequest.upnLogin},` + this.parentDn,
          attributes: [
            new PartialAttribute({
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
            new PartialAttribute({
              type: 'mail',
              vals: [this.setupRequest.email],
            }),
            new PartialAttribute({
              type: 'description',
              vals: [this.setupRequest.description],
            }),
            new PartialAttribute({
              type: 'sAMAccountName',
              vals: [this.setupRequest.upnLogin],
            }),
            new PartialAttribute({
              type: 'userAccountControl',
              vals: [this.setupRequest.uacBitSet.toString(10)],
            }),
            new PartialAttribute({
              type: 'userPrincipalName',
              vals: [this.setupRequest.upnLogin + '@' + this.setupRequest.upnDomain],
            }),
            new PartialAttribute({
              type: 'displayName',
              vals: [this.setupRequest.fullName],
            }),
            new PartialAttribute({
              type: 'givenName',
              vals: [this.setupRequest.firstName],
            }),
            new PartialAttribute({
              type: 'initials',
              vals: [this.setupRequest.initials],
            }),
            new PartialAttribute({
              type: 'surname',
              vals: [this.setupRequest.lastName],
            }),
          ],
          password: this.setupRequest.password,
        }),
      )
      .pipe(
        catchError((err) => {
          this.modalControl.modal?.hideSpinner();
          throw err;
        }),
      )
      .subscribe((x) => {
        this.modalControl.modal?.hideSpinner();
        this.modalControl?.close(x);
      });
  }

  onClose(): void {
    this.modalControl?.close(null);
  }

  nextStep() {
    if (!this.formValid) {
      this.setup.invalidate();
      this.toastr.error(translate('please-check-errors'));
      return;
    }
    this.stepper.next();
  }
}
