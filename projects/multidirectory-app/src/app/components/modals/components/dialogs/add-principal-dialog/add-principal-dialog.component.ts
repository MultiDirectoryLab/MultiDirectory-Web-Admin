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
import { PatternWithMessageDirective } from '@core/validators/pattern-with-message.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from '../../../services/dialog.service';
import { DialogRef } from '@angular/cdk/dialog';
import { catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddPrincipalRequest } from '@models/kerberos/add-principal-request';
import { AddPrincipalDialogReturnData } from '../../../interfaces/add-principal-dialog.interface';

@Component({
  selector: 'app-add-principal-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    PatternWithMessageDirective,
    RequiredWithMessageDirective,
    TranslocoPipe,
    FormsModule,
  ],
  templateUrl: './add-principal-dialog.component.html',
  styleUrl: './add-principal-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPrincipalDialogComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  @ViewChild(DialogComponent, { static: true }) dialogComponent!: DialogComponent;

  public formValid = false;
  public principalName = '';

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<AddPrincipalDialogReturnData, AddPrincipalDialogComponent> =
    inject(DialogRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private toastr: ToastrService = inject(ToastrService);
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

    this.dialogComponent.showSpinner();
    const request = new AddPrincipalRequest(this.principalName);

    this.api
      .addPrincipal(request)
      .pipe(
        catchError(() => {
          this.toastr.error(translate('add-principal.unable-to-add'));
          this.dialogComponent.hideSpinner();

          return EMPTY;
        }),
      )
      .subscribe((x) => {
        this.dialogComponent.hideSpinner();
        this.dialogService.close(this.dialogRef, x);
      });
  }

  public onClose() {
    this.dialogService.close(this.dialogRef, null);
  }
}
