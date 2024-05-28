import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { DropdownOption, MdFormComponent } from 'multidirectory-ui-kit';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { UserCreateService } from '@services/user-create.service';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';

@Component({
  selector: 'app-user-create-general-info',
  styleUrls: ['./general-info.component.scss'],
  templateUrl: './general-info.component.html',
})
export class UserCreateGeneralInfoComponent implements AfterViewInit, OnDestroy {
  private _setupRequest!: UserCreateRequest;
  @Input() set setupRequest(request: UserCreateRequest) {
    this._setupRequest = request;
    this.form?.inputs.forEach((x) => x.reset());
  }
  get setupRequest(): UserCreateRequest {
    return this._setupRequest;
  }

  @ViewChild('form') form!: MdFormComponent;
  @ViewChildren(AbstractControl) controls!: QueryList<AbstractControl>;

  unsubscribe = new Subject<void>();
  domains: DropdownOption[] = [];
  constructor(
    public setup: UserCreateService,
    private ldapLoader: LdapEntryLoader,
  ) {}
  ngAfterViewInit(): void {
    this.setup.stepValid(this.form.valid);
    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form.validate();
    });
    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.setup.stepValid(this.form.valid);
    });
    this.ldapLoader
      .get()
      .pipe(take(1))
      .subscribe((domains) => {
        this.domains = domains.map(
          (x) =>
            new DropdownOption({
              title: x.name,
              value: x.name,
            }),
        );
        this.setupRequest.upnDomain = this.domains?.[0]?.value;
      });
  }

  ngOnDestroy(): void {
    this.form.inputs.forEach((x) => x.reset());
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onNameChange() {
    this.setupRequest.fullName = `${this.setupRequest.firstName} ${this.setupRequest.initials} ${this.setupRequest.lastName}`;
  }
}
