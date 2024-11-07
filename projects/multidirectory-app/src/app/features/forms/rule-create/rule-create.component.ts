import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { CreateEntryRequest } from '@models/entry/create-request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rule-create',
  templateUrl: './rule-create.component.html',
  styleUrls: ['./rule-create.component.scss'],
})
export class RuleCreateComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  private _unsubscribe = new Subject<void>();
  formValid = false;
  parentDn = '';
  description = '';
  ruleName = '';

  constructor(
    private api: MultidirectoryApiService,
    @Inject(ModalInjectDirective) private modalInejctor: ModalInjectDirective,
  ) {}

  ngOnInit(): void {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
    this.parentDn = this.modalInejctor.contentOptions?.['parentDn'] ?? '';
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.api
      .create(
        new CreateEntryRequest({
          entry: `cn=${this.ruleName},` + this.parentDn,
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
        this.modalInejctor.close(x);
      });
  }

  onClose() {
    this.modalInejctor.close(null);
  }
}
