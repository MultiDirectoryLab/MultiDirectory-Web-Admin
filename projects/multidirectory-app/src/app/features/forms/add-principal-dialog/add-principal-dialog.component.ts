import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-principal-dialog',
  templateUrl: './add-principal-dialog.component.html',
  styleUrls: ['./add-principal-dialog.component.scss'],
})
export class AddPrincipalDialogComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  private _unsubscribe = new Subject<void>();
  formValid = false;
  principalName = '';

  constructor(
    private api: MultidirectoryApiService,
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
    this.api.addPrincipal(this.principalName).subscribe((x) => {
      this.modalInejctor.close(x);
    });
  }

  onClose() {
    this.modalInejctor.close(null);
  }
}
