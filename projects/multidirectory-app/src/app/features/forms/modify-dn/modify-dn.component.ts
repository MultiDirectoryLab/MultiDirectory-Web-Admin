import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { ModifyDnRequest } from '@models/modify-dn/modify-dn';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { EntitySelectorComponent } from '../entity-selector/entity-selector.component';
import { Subject, take, takeUntil } from 'rxjs';
import { AppWindowsService } from '@services/app-windows.service';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';

@Component({
  selector: 'app-modify-dn',
  templateUrl: './modify-dn.component.html',
  styleUrls: ['./modify-dn.component.scss'],
})
export class ModifyDnComponent implements AfterViewInit, OnDestroy {
  @ViewChild('form') form!: MdFormComponent;
  private unsubscribe = new Subject<void>();
  formValid = false;
  request = new ModifyDnRequest();

  constructor(
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
    private windows: AppWindowsService,
  ) {}

  ngAfterViewInit(): void {
    this.request.entry = this.modalControl.contentOptions?.['toModifyDn'];
    this.request.new_superior = LdapNamesHelper.getDnParent(this.request.entry);
    this.request.newrdn = LdapNamesHelper.getDnName(this.request.entry);

    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
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
      .openEntitySelector([])
      .pipe(take(1))
      .subscribe((x) => {
        this.request.new_superior = x?.[0]?.id ?? '';
      });
  }
}
