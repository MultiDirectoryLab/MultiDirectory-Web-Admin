import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  viewChild,
  viewChildren,
} from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';
import {
  DropdownComponent,
  DropdownOption,
  MdFormComponent,
  TextareaComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-create-general-info',
  styleUrls: ['./general-info.component.scss'],
  templateUrl: './general-info.component.html',
  imports: [
    TranslocoPipe,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    TextareaComponent,
    DropdownComponent,
    MdFormComponent,
  ],
})
export class UserCreateGeneralInfoComponent implements AfterViewInit, OnDestroy {
  private ldapLoader = inject(LdapEntryLoader);
  private cdr = inject(ChangeDetectorRef);
  setup = inject(UserCreateService);
  readonly form = viewChild.required<MdFormComponent>('form');
  readonly controls = viewChildren(AbstractControl);
  unsubscribe = new Subject<void>();
  domains: DropdownOption[] = [];

  private _setupRequest!: UserCreateRequest;

  get setupRequest(): UserCreateRequest {
    return this._setupRequest;
  }

  @Input() set setupRequest(request: UserCreateRequest) {
    this._setupRequest = request;
    this.form()?.inputs?.forEach((x) => x.reset());
  }

  ngAfterViewInit(): void {
    const form = this.form();
    this.setup.stepValid(form.valid);
    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form().validate();
    });
    form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.setup.stepValid(this.form().valid);
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
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.form().inputs.forEach((x) => x.reset());
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onNameChange() {
    this.setupRequest.fullName = `${this.setupRequest.firstName} ${this.setupRequest.initials} ${this.setupRequest.lastName}`;
  }
}
