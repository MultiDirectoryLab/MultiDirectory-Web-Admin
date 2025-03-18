import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MdFormComponent, MdModalComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

@Component({
  selector: 'app-catalog-create',
  templateUrl: './catalog-create.component.html',
  styleUrls: ['./catalog-create.component.scss'],
})
export class CatalogCreateComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  private _unsubscribe = new Subject<void>();
  formValid = false;
  parentDn = '';
  description = '';
  catalogName = '';

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
          entry: `cn=${this.catalogName},` + this.parentDn,
          attributes: [
            new PartialAttribute({
              type: 'objectClass',
              vals: ['top', 'container', 'catalog'],
            }),
            new PartialAttribute({
              type: 'description',
              vals: [this.description],
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
