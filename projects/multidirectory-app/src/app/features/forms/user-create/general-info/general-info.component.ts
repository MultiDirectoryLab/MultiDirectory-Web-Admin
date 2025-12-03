import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  viewChild,
  viewChildren,
} from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserCreateRequest } from '@models/api/user-create/user-create.request';
import { LdapTreeService } from '@services/ldap/ldap-tree.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { UserCreateService } from '@services/user-create.service';
import {
  DropdownComponent,
  DropdownOption,
  MdFormComponent,
  TextareaComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { from, Subject, take, takeUntil } from 'rxjs';
import { MaxLengthValidatorDirective } from '@core/validators/max-length.directive';

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
    CommonModule,
    MaxLengthValidatorDirective
  ],
})
export class UserCreateGeneralInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  setup = inject(UserCreateService);
  readonly form = viewChild.required<MdFormComponent>('form');
  readonly controls = viewChildren(AbstractControl);
  unsubscribe = new Subject<void>();
  domains: DropdownOption[] = [];
  ldapTreeviewService = inject(LdapTreeviewService);
  private readonly cdr = inject(ChangeDetectorRef);

  private _setupRequest!: UserCreateRequest;

  get setupRequest(): UserCreateRequest {
    return this._setupRequest;
  }

  @Input() set setupRequest(request: UserCreateRequest) {
    this._setupRequest = request;
    this.form()?.inputs?.forEach((x) => x.reset());
  }

  ngOnInit(): void {
    from(this.ldapTreeviewService.load(''))
      .pipe(take(1))
      .subscribe((ldapTree) => {
        this.domains = ldapTree.map(
          (x) =>
            new DropdownOption({
              title: x.name,
              value: x.name,
            }),
        );
        this._setupRequest.upnDomain = this.domains[0].value;
        this.cdr.detectChanges();
      });
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
