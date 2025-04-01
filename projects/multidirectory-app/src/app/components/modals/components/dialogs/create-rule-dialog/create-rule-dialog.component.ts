import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { FormsModule } from '@angular/forms';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { CreateRuleDialogData } from '../../../interfaces/create-rule-dialog.interface';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../services/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateEntryRequest } from '@models/entry/create-request';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

@Component({
  selector: 'app-create-rule-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    TranslocoPipe,
    MultidirectoryUiKitModule,
    RequiredWithMessageDirective,
    FormsModule,
  ],
  templateUrl: './create-rule-dialog.component.html',
  styleUrl: './create-rule-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRuleDialogComponent implements OnInit {
  public dialogData: CreateRuleDialogData = inject(DIALOG_DATA);

  @ViewChild('form', { static: true }) form!: MdFormComponent;

  public formValid = false;
  public description = '';
  public ruleName = '';

  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);
  private destroyRef$: DestroyRef = inject(DestroyRef);

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
          entry: `cn=${this.ruleName},` + this.dialogData.parentDn,
          attributes: [
            new PartialAttribute({
              type: 'objectClass',
              vals: ['top', 'sudoRole'],
            }),
            new PartialAttribute({
              type: 'description',
              vals: [this.description],
            }),
            new PartialAttribute({
              type: 'sudoUser',
              vals: ['!ALL'],
            }),
            new PartialAttribute({
              type: 'sudoHost',
              vals: ['!ALL'],
            }),
            new PartialAttribute({
              type: 'sudoCommand',
              vals: ['!ALL'],
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
