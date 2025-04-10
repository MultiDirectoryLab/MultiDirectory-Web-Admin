import { AfterViewInit, Component, inject, OnDestroy, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { TranslocoPipe } from '@jsverse/transloco';
import { ModifyDnRequest } from '@models/modify-dn/modify-dn';
import { AppWindowsService } from '@services/app-windows.service';
import {
  ButtonComponent,
  CheckboxComponent,
  MdFormComponent,
  ModalInjectDirective,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';
import { EntitySelectorSettings } from '../entity-selector/entity-selector-settings.component';

@Component({
  selector: 'app-modify-dn',
  templateUrl: './modify-dn.component.html',
  styleUrls: ['./modify-dn.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    FormsModule,
    ButtonComponent,
    CheckboxComponent,
  ],
})
export class ModifyDnComponent implements AfterViewInit, OnDestroy {
  private modalControl = inject<ModalInjectDirective>(ModalInjectDirective);
  private windows = inject(AppWindowsService);
  private unsubscribe = new Subject<void>();
  readonly form = viewChild.required<MdFormComponent>('form');
  formValid = false;
  request = new ModifyDnRequest();

  ngAfterViewInit(): void {
    this.request.entry = this.modalControl.contentOptions?.['toModifyDn'];
    this.request.new_superior = LdapNamesHelper.getDnParent(this.request.entry);
    this.request.newrdn = LdapNamesHelper.getDnName(this.request.entry);

    this.form()
      .onValidChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((valid) => {
        this.formValid = valid;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClose() {
    this.modalControl.close(null);
  }

  onFinish(event: Event) {
    this.modalControl.close(this.request);
  }

  showEntrySelector(event: Event) {
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
        this.request.new_superior = x?.[0]?.id ?? '';
      });
  }
}
