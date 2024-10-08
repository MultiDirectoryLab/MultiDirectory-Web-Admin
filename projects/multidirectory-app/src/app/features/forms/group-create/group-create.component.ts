import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { CreateEntryRequest } from '@models/entry/create-request';
import { GroupCreateRequest } from '@models/group-create/group-create.request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { translate } from '@jsverse/transloco';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss'],
})
export class GroupCreateComponent implements OnInit, OnDestroy {
  @ViewChild('groupForm', { static: true }) private _form!: MdFormComponent;
  private _unsubscribe = new Subject<boolean>();
  setupRequest = new GroupCreateRequest();
  formValid: boolean = false;
  parentDn = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private api: MultidirectoryApiService,
    private toastr: ToastrService,
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
  ) {}

  ngOnInit(): void {
    this._form?.onValidChanges.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
    this.parentDn = this.modalControl.contentOptions?.['parentDn'] ?? '';
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(true);
    this._unsubscribe.complete();
  }

  onClose() {
    this.setupRequest = new GroupCreateRequest();
    this.modalControl.close(null);
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.formValid) {
      this.toastr.error(translate('please-check-errors'));
      this._form.validate();
      return;
    }
    this.modalControl?.modal?.showSpinner();
    this.api
      .create(
        new CreateEntryRequest({
          entry: `cn=${this.setupRequest.groupName},` + this.parentDn,
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
          this.modalControl.modal?.hideSpinner();
          this.toastr.error(translate('group-create.unable-create-group'));
          this.modalControl.close(null);
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        this.modalControl?.modal?.hideSpinner();
        this.setupRequest = new GroupCreateRequest();
        this.modalControl?.close(x);
      });
  }
}
