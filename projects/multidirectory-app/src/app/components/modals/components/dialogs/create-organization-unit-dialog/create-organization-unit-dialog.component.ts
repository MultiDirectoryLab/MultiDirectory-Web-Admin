import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { CreateOrganizationUnitDialogData } from '../../../interfaces/create-organization-unit-dialog.interface';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { SchemaService } from '@services/schema/schema.service';
import { catchError, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-organization-unit-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    FormsModule,
  ],
  templateUrl: './create-organization-unit-dialog.component.html',
  styleUrl: './create-organization-unit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrganizationUnitDialogComponent implements OnInit {
  dialogData: CreateOrganizationUnitDialogData = inject(DIALOG_DATA);

  @ViewChild('form', { static: true }) form!: MdFormComponent;

  formValid = false;
  description = '';
  ouName = '';

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);
  private destroyRef$: DestroyRef = inject(DestroyRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private schema = inject(SchemaService);

  ngOnInit() {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.formValid = x;
    });
  }

  getObjectClasses(): Observable<string[]> {
    return this.schema.getSchemaEntity('Organizational Unit').pipe(
      map((result) => {
        return result.object_class_names;
      }),
    );
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.getObjectClasses()
      .pipe(
        switchMap((objectClasses) => {
          return this.api.create(
            new CreateEntryRequest({
              entry: `ou=${this.ouName},` + this.dialogData.parentDn,
              attributes: [
                new LdapAttribute({
                  type: 'objectClass',
                  vals: objectClasses,
                }),
                new LdapAttribute({
                  type: 'description',
                  vals: [this.description],
                }),
              ],
            }),
          );
        }),
      )
      .subscribe((x) => {
        this.dialogService.close(this.dialogRef, x);
      });
  }

  onClose() {
    this.dialogService.close(this.dialogRef, null);
  }
}
