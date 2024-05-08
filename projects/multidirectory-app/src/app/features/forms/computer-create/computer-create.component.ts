import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MdFormComponent, MdModalComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { CreateEntryRequest } from '@models/entry/create-request';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { PartialAttribute } from '@core/ldap/ldap-partial-attribute';
import { EntitySelectorComponent } from '../entity-selector/entity-selector.component';

@Component({
  selector: 'app-computer-create',
  templateUrl: './computer-create.component.html',
  styleUrls: ['./computer-create.component.scss'],
})
export class ComputerCreateComponent implements AfterViewInit, OnDestroy {
  @Output() onCreate = new EventEmitter<void>();
  @ViewChild('form') form!: MdFormComponent;
  @ViewChild('groupSelector') groupSelector!: EntitySelectorComponent;
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
    @Inject(ModalInjectDirective) private modalInejctor: ModalInjectDirective,
  ) {}

  ngAfterViewInit(): void {
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
          entry: `ou=${this.computerName},` + this.parentDn,
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
    this.groupSelector
      .open()
      .pipe(take(1))
      .subscribe((x) => {
        this.ownerDn = x?.[0]?.id ?? '';
      });
  }
}
