import { AfterViewInit, Component, forwardRef, inject, Input, OnDestroy, signal, viewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/api/setup/setup-request';
import { ContextMenuRef } from '@models/core/context-menu/context-menu-ref';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { AutofocusDirective, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
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
  ],
})
export class AdminSettingsComponent implements AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;

  readonly form = viewChild.required<MdFormComponent>('form');
  private passwordInput = viewChild.required<NgModel>('passwordInput');

  private suggestDialogRef: ContextMenuRef<unknown, PasswordSuggestContextMenuComponent> | null = null;
  private password = signal('');
  private unsubscribe = new Subject<void>();
  protected passwordPolicy = new PasswordPolicy();

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

  protected checkModel() {
    this.form().validate(true);
    this.password.set(this.passwordInput().value);

    if (this.passwordInput().valid) {
      this.closeSuggest();
    }
  }

  protected openSuggest(event: FocusEvent): void {
    const target = ((event as unknown as Event).target as HTMLElement).parentElement as HTMLElement;
    const targetRect = target.getBoundingClientRect();

    this.suggestDialogRef = this.contextMenuService.open({
      contextMenuConfig: {
        hasBackdrop: false,
        data: { password: this.password, policy: this.passwordPolicy },
      },
      component: PasswordSuggestContextMenuComponent,
      y: targetRect.y,
      x: targetRect.right + 8,
    });
  }

  private closeSuggest(): void {
    if (this.suggestDialogRef) {
      this.suggestDialogRef.close(null);
    }
  }
}
