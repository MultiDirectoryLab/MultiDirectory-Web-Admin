import { AfterViewInit, Component, computed, forwardRef, inject, Input, OnDestroy, signal, viewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/api/setup/setup-request';
import { ContextMenuRef } from '@models/core/context-menu/context-menu-ref';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { AutofocusDirective, ButtonComponent, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { PasswordSuggestContextMenuComponent } from '../../../components/modals/components/context-menus/password-suggest-context-menu/password-suggest-context-menu.component';
import { ContextMenuService } from '../../../components/modals/services/context-menu.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
  providers: [
    {
      provide: MdFormComponent,
      useExisting: forwardRef(() => AdminSettingsComponent),
      multi: true,
    },
  ],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    AutofocusDirective,
    FormsModule,
    PasswordMatchValidatorDirective,
    PasswordValidatorDirective,
    ButtonComponent,
    PasswordConditionsComponent,
  ],
})
export class AdminSettingsComponent implements AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;

  readonly form = viewChild.required<MdFormComponent>('form');
  private passwordInput = viewChild.required<NgModel>('passwordInput');

  protected passwordPolicy = new PasswordPolicy();
  protected password = signal('');
  protected showPasswordRequirements = signal<boolean>(false);
  protected passwordRequirementsLabel = computed(() =>
    this.showPasswordRequirements()
      ? translate('user-create.password-settings.hide-password-requirements')
      : translate('user-create.password-settings.show-password-requirements'),
  );
  private suggestDialogRef: ContextMenuRef<unknown, PasswordSuggestContextMenuComponent> | null = null;
  private unsubscribe = new Subject<void>();

  private contextMenuService = inject(ContextMenuService);
  private setupRequestValidatorService = inject(SetupRequestValidatorService);

  ngAfterViewInit(): void {
    const form = this.form();
    this.setupRequestValidatorService.stepValid(form.valid);

    this.setupRequestValidatorService.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form().validate();
    });

    form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
      this.setupRequestValidatorService.stepValid(valid);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  protected togglePasswordRequirements(): void {
    this.showPasswordRequirements.update((prev) => !prev);
  }

  protected checkModel() {
    this.form().validate(true);
    this.password.set(this.passwordInput().value);
  }
}
