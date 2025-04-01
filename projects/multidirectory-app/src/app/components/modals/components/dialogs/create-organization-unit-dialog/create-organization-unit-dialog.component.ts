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
import { CreateEntryRequest } from '@models/entry/create-request';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

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
  public dialogData: CreateOrganizationUnitDialogData = inject(DIALOG_DATA);

  @ViewChild('form', { static: true }) form!: MdFormComponent;

  public formValid = false;
  public description = '';
  public ouName = '';

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);
  private destroyRef$: DestroyRef = inject(DestroyRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);

  public ngOnInit() {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.formValid = x;
    });
  }

  public onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.api
      .create(
        new CreateEntryRequest({
          entry: `ou=${this.ouName},` + this.dialogData.parentDn,
          attributes: [
            new PartialAttribute({
              type: 'objectClass',
              vals: ['top', 'container', 'organizationalUnit'],
            }),
            new PartialAttribute({
              type: 'description',
              vals: [this.description],
            }),
          ],
        }),
      )
      .subscribe((x) => {
        this.dialogService.close(this.dialogRef, x);
      });
  }

  public onClose() {
    this.dialogService.close(this.dialogRef, null);
  }
}
