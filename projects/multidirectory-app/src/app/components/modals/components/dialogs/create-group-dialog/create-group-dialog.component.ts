import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { translate, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { GroupCreateRequest } from '@models/group-create/group-create.request';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  CreateGroupDialogData,
  CreateGroupDialogReturnData,
} from '../../../interfaces/create-group-dialog.interface';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { CreateEntryRequest } from '@models/entry/create-request';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

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
  public dialogData: CreateGroupDialogData = inject(DIALOG_DATA);
  public setupRequest = new GroupCreateRequest();
  public formValid = false;

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<CreateGroupDialogReturnData, CreateGroupDialogComponent> =
    inject(DialogRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private toastr: ToastrService = inject(ToastrService);

  @ViewChild('groupForm', { static: true }) private _form!: MdFormComponent;
  @ViewChild('dialogComponent', { static: true }) private dialogComponent!: DialogComponent;

  private _unsubscribe = new Subject<boolean>();

  /**LIFECYCLE HOOKS  **/
  public ngOnInit(): void {
    this._form?.onValidChanges.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
  }

  public onClose() {
    this.setupRequest = new GroupCreateRequest();
    this.dialogService.close(this.dialogRef);
  }

  public onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.formValid) {
      this.toastr.error(translate('please-check-errors'));
      this._form.validate();
      return;
    }
    this.dialogComponent?.showSpinner();
    this.api
      .create(
        new CreateEntryRequest({
          entry: `cn=${this.setupRequest.groupName},` + this.dialogData.parentDn,
          attributes: [
            new PartialAttribute({
              type: 'objectClass',
              vals: ['group', 'top', 'posixGroup'],
            }),
            new PartialAttribute({
              type: 'description',
              vals: [this.setupRequest.description],
            }),
          ],
        }),
      )
      .pipe(
        catchError((err) => {
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
