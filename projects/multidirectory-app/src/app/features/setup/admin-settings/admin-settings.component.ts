import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import {
  AutofocusDirective,
  MdFormComponent,
  PopupContainerDirective,
  PopupSuggestComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

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
    PopupContainerDirective,
    PopupSuggestComponent,
    PasswordConditionsComponent,
  ],
})
export class AdminSettingsComponent implements AfterViewInit, OnDestroy {
  private setupRequestValidatorService = inject(SetupRequestValidatorService);

  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  @ViewChild('passwordInput') passwordInput!: TextboxComponent;
  @ViewChild('repeatPassword') repeatPassword!: TextboxComponent;

  unsubscribe = new Subject<void>();

  ngAfterViewInit(): void {
    this.setupRequestValidatorService.stepValid(this.form.valid);

    this.setupRequestValidatorService.invalidateRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.form.validate();
      });

    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
      this.setupRequestValidatorService.stepValid(valid);
    });
  }

  checkModel() {
    this.form.validate(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
