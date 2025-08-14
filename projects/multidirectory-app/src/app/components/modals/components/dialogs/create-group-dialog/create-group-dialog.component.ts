import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { translate, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { catchError, EMPTY, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  CreateGroupDialogData,
  CreateGroupDialogReturnData,
} from '../../../interfaces/create-group-dialog.interface';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { GroupCreateRequest } from '@models/api/group-create/group-create.request';
import { SchemaService } from '@services/schema/schema.service';

@Component({
  selector: 'app-create-group-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    RequiredWithMessageDirective,
    TranslocoDirective,
    FormsModule,
    TranslocoPipe,
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGroupDialogComponent implements OnInit {
  dialogData: CreateGroupDialogData = inject(DIALOG_DATA);
  setupRequest = new GroupCreateRequest();
  formValid = false;

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<CreateGroupDialogReturnData, CreateGroupDialogComponent> =
    inject(DialogRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private toastr: ToastrService = inject(ToastrService);
  private schema = inject(SchemaService);

  @ViewChild('groupForm', { static: true }) private _form!: MdFormComponent;
  @ViewChild('dialogComponent', { static: true }) private dialogComponent!: DialogComponent;

  private _unsubscribe = new Subject<boolean>();

  getObjectClasses(): Observable<string[]> {
    return this.schema.getSchemaEntity('Group').pipe(
      map((result) => {
        return result.object_class_names;
      }),
    );
  }

  /**LIFECYCLE HOOKS  **/
  ngOnInit(): void {
    this._form?.onValidChanges.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
  }

  onClose() {
    this.setupRequest = new GroupCreateRequest();
    this.dialogService.close(this.dialogRef);
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.formValid) {
      this.toastr.error(translate('please-check-errors'));
      this._form.validate();
      return;
    }
    this.dialogComponent?.showSpinner();
    this.getObjectClasses()
      .pipe(
        switchMap((objectClasses) => {
          return this.api.create(
            new CreateEntryRequest({
              entry: `cn=${this.setupRequest.groupName},` + this.dialogData.parentDn,
              attributes: [
                new LdapAttribute({
                  type: 'objectClass',
                  vals: objectClasses,
                }),
                new LdapAttribute({
                  type: 'description',
                  vals: [this.setupRequest.description],
                }),
              ],
            }),
          );
        }),
        catchError(() => {
          this.dialogComponent?.hideSpinner();
          this.toastr.error(translate('group-create.unable-create-group'));
          this.dialogService.close(this.dialogRef);
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        this.dialogComponent?.hideSpinner();
        this.setupRequest = new GroupCreateRequest();
        this.dialogService.close(this.dialogRef, x);
      });
  }
}
