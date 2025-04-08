import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatternWithMessageDirective } from '@core/validators/pattern-with-message.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AddPrincipalRequest } from '@models/kerberos/add-principal-request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  MdFormComponent,
  ModalInjectDirective,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-principal-dialog',
  templateUrl: './add-principal-dialog.component.html',
  styleUrls: ['./add-principal-dialog.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
    FormsModule,
    ButtonComponent,
  ],
})
export class AddPrincipalDialogComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  formValid = false;
  principalName = '';
  private _unsubscribe = new Subject<void>();

  constructor(
    private api: MultidirectoryApiService,
    private toastr: ToastrService,
    @Inject(ModalInjectDirective) private modalInejctor: ModalInjectDirective,
  ) {}

  ngOnInit(): void {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.modalInejctor.showSpinner();
    const request = new AddPrincipalRequest(this.principalName);
    this.api
      .addPrincipal(request)
      .pipe(
        catchError((err) => {
          this.toastr.error(translate('add-principal.unable-to-add'));
          console.log(err);
          this.modalInejctor.hideSpinner();
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        this.modalInejctor.hideSpinner();
        this.modalInejctor.close(x);
      });
  }

  onClose() {
    this.modalInejctor.close(null);
  }
}
