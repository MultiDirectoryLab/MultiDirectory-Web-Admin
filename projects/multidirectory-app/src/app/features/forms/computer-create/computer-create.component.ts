import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { CreateEntryRequest } from '@models/entry/create-request';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';
import { EntitySelectorSettings } from '../entity-selector/entity-selector-settings.component';

@Component({
  selector: 'app-computer-create',
  templateUrl: './computer-create.component.html',
  styleUrls: ['./computer-create.component.scss'],
})
export class ComputerCreateComponent implements OnInit, OnDestroy {
  @Output() create = new EventEmitter<void>();
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  private _unsubscribe = new Subject<void>();
  formValid = false;
  parentDn = '';
  description = '';
  computerName = '';
  legacyComputerName = '';
  ownerDn = '';
  isLegacyAccount = false;

  constructor(
    private api: MultidirectoryApiService,
    private windows: AppWindowsService,
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
          entry: `cn=${this.computerName},` + this.parentDn,
          attributes: [
            new PartialAttribute({
              type: 'objectClass',
              vals: ['top', 'computer', 'user'],
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
