import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { map, Observable, switchMap, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CreateComputerDialogData } from '../../../interfaces/create-computer-dialog.interface';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { EntitySelectorDialogComponent } from '../entity-selector-dialog/entity-selector-dialog.component';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
  EntitySelectorSettings,
} from '../../../interfaces/entity-selector-dialog.interface';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { SchemaService } from '@services/schema/schema.service';

@Component({
  selector: 'app-create-computer-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    FormsModule,
  ],
  templateUrl: './create-computer-dialog.component.html',
  styleUrl: './create-computer-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComputerDialogComponent implements OnInit {
  public dialogData: CreateComputerDialogData = inject(DIALOG_DATA);

  @ViewChild('form', { static: true }) form!: MdFormComponent;

  public formValid = false;
  public description = '';
  public computerName = '';
  public legacyComputerName = '';
  public ownerDn = model('');
  public isLegacyAccount = false;

  private destroyRef$: DestroyRef = inject(DestroyRef);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private schema = inject(SchemaService);

  public ngOnInit(): void {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.formValid = x;
    });
  }

  getObjectClasses(): Observable<string[]> {
    return this.schema.getSchemaEntity('Computer').pipe(
      map((result) => {
        return result.object_class_names;
      }),
    );
  }

  public onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.getObjectClasses()
      .pipe(
        switchMap((objectClasses) => {
          return this.api.create(
            new CreateEntryRequest({
              entry: `cn=${this.computerName},` + this.dialogData.parentDn,
              attributes: [
                new LdapAttribute({
                  type: 'objectClass',
                  vals: ['top', 'computer'],
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

  public onClose() {
    this.dialogService.close(this.dialogRef, null);
  }

  public showAccountSelector(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.dialogService
      .open<
        EntitySelectorDialogReturnData,
        EntitySelectorDialogData,
        EntitySelectorDialogComponent
      >({
        component: EntitySelectorDialogComponent,
        dialogConfig: {
          minHeight: '360px',
          data: new EntitySelectorSettings({
            selectedEntities: [],
            selectedPlaceDn: this.dialogData.parentDn,
          }),
        },
      })
      .closed.pipe(take(1))
      .subscribe((x) => {
        this.ownerDn.set(x?.[0]?.id ?? '');
      });
  }
}
