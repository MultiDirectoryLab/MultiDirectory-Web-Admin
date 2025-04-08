import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { CreateEntryRequest } from '@models/entry/create-request';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  CheckboxComponent,
  MdFormComponent,
  ModalInjectDirective,
  TextareaComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';
import { EntitySelectorSettings } from '../entity-selector/entity-selector-settings.component';

@Component({
  selector: 'app-computer-create',
  templateUrl: './computer-create.component.html',
  styleUrls: ['./computer-create.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    ButtonComponent,
    CheckboxComponent,
    TextareaComponent,
  ],
})
export class ComputerCreateComponent implements OnInit, OnDestroy {
  private api = inject(MultidirectoryApiService);
  private windows = inject(AppWindowsService);
  private modalInejctor = inject<ModalInjectDirective>(ModalInjectDirective);

  @Output() create = new EventEmitter<void>();
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  formValid = false;
  parentDn = '';
  description = '';
  computerName = '';
  legacyComputerName = '';
  ownerDn = '';
  isLegacyAccount = false;
  private _unsubscribe = new Subject<void>();

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
          entry: `cn=${this.computerName},` + this.parentDn,
          attributes: [
            new PartialAttribute({
              type: 'objectClass',
              vals: ['top', 'computer'],
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

  showAccountSelector(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.windows
      .openEntitySelector(
        new EntitySelectorSettings({
          selectedEntities: [],
        }),
      )
      .pipe(take(1))
      .subscribe((x) => {
        this.ownerDn = x?.[0]?.id ?? '';
      });
  }
}
