import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryUiKitModule, StepperComponent } from 'multidirectory-ui-kit';
import { DialogService } from '../../../services/dialog.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, EMPTY, map, Subject, switchMap } from 'rxjs';
import { CreateUserDialogData, CreateUserDialogReturnData } from '../../../interfaces/user-create-dialog.interface';
import { UserCreateRequest } from '@models/api/user-create/user-create.request';
import { SchemaService } from '@services/schema/schema.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

@Component({
  selector: 'app-user-create-dialog',
  standalone: true,
  imports: [DialogComponent, TranslocoPipe, MultidirectoryUiKitModule, ReactiveFormsModule],
  templateUrl: './create-contact-dialog.component.html',
  styleUrl: './create-contact-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateContactDialogComponent implements OnInit {
  @ViewChild('createUserStepper', { static: true }) stepper!: StepperComponent;
  @ViewChild('dialogComponent', { static: true }) dialogComponent!: DialogComponent;
  private schema = inject(SchemaService);
  private readonly dialog = inject(DialogService);
  setupRequest = new UserCreateRequest();
  unsubscribe = new Subject<void>();
  formValid = false;

  private dialogRef: DialogRef<CreateUserDialogReturnData, CreateContactDialogComponent> = inject(DialogRef);
  private dialogService: DialogService = inject(DialogService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private toastr: ToastrService = inject(ToastrService);
  private dialogData: CreateUserDialogData = inject(DIALOG_DATA);
  parentDn = this.dialogData.dn;
  private fb = inject(FormBuilder);
  private displayNameWasSet: boolean = false;

  contactForm = this.fb.group({
    cn: [{ value: '', disabled: true }, [Validators.required]],
    displayName: [''],
    givenName: ['', [Validators.required]],
    surname: ['', [Validators.required]],
  });

  ngOnInit() {
    this.calcDisplayName();
  }

  calcDisplayName() {
    this.contactForm
      .get('givenName')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        if (!this.displayNameWasSet) {
          const surname = this.contactForm.get('surname')?.value;
          if (value) {
            this.contactForm.get('cn')?.setValue(`${value} ${surname}`); // Пример: преобразуем в верхний регистр
          }
        }
      });
    this.contactForm
      .get('surname')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        if (!this.displayNameWasSet) {
          const givenName = this.contactForm.get('givenName')?.value;
          if (value) {
            this.contactForm.get('cn')?.setValue(`${givenName} ${value}`); // Пример: преобразуем в верхний регистр
          }
        }
      });
  }

  cancel() {
    this.dialog.close(this.dialogRef);
  }
  getObjectClasses() {
    return this.schema.getSchemaEntity('Contact').pipe(
      map((result) => {
        return result.object_class_names;
      }),
    );
  }
  create() {
    this.contactForm.updateValueAndValidity();
    if (!this.contactForm.valid) {
      this.toastr.error(translate('please-check-errors'));
      return;
    }

    this.dialogComponent?.showSpinner();
    this.getObjectClasses()
      .pipe(
        switchMap((objectClasses) => {
          return this.api.create(
            new CreateEntryRequest({
              entry: `cn=${this.contactForm.controls.cn.value},` + this.parentDn,
              attributes: [
                new LdapAttribute({
                  type: 'objectClass',
                  vals: objectClasses,
                }),
                new LdapAttribute({
                  type: 'displayName',
                  vals: [this.contactForm.controls.displayName.value as string],
                }),
                new LdapAttribute({
                  type: 'givenName',
                  vals: [this.contactForm.controls.givenName.value as string],
                }),
                new LdapAttribute({
                  type: 'surname',
                  vals: [this.contactForm.controls.surname.value as string],
                }),
                new LdapAttribute({
                  type: 'cn',
                  vals: [this.contactForm.controls.cn.value as string],
                }),
              ],
            }),
          );
        }),
        catchError(() => {
          this.dialogComponent?.hideSpinner();
          this.toastr.error(translate('contact-create.unable-create-contact'));
          this.dialogService.close(this.dialogRef);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        const newItem = {
          object_name: `cn=${this.contactForm.controls.cn.value},` + this.parentDn,
          partial_attributes: [
            {
              type: 'objectClass',
              vals: ['contact', 'mailRecipient', 'organizationalPerson', 'person', 'top'],
            },
            {
              type: 'name',
              vals: [this.contactForm.controls.cn.value],
            },
            {
              type: 'entityTypeName',
              vals: ['Contact'],
            },
          ],
        };
        this.dialogComponent?.hideSpinner();
        this.dialogService.close(this.dialogRef, newItem);
      });
  }
}
