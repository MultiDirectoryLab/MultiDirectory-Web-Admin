import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalInjectDirective, StepperComponent } from 'multidirectory-ui-kit';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { UserCreateService } from '@services/user-create.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { CreateEntryRequest } from '@models/entry/create-request';
import { ToastrService } from 'ngx-toastr';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { translate } from '@jsverse/transloco';
import BitSet from 'bitset';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
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
