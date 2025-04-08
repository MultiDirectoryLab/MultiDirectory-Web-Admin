import { AfterViewInit, Component, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { DomainFormatValidatorDirective } from '@core/validators/domainformat.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import {
  AutofocusDirective,
  CheckboxComponent,
  MdFormComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-domain-settings',
  templateUrl: './domain-settings.component.html',
  styleUrls: ['./domain-settings.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    DomainFormatValidatorDirective,
    RequiredWithMessageDirective,
    AutofocusDirective,
    FormsModule,
    CheckboxComponent,
  ],
})
export class DomainSettingsComponent implements AfterViewInit, OnDestroy {
  private setupRequestValidatorService = inject(SetupRequestValidatorService);

  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  name = new FormControl('');
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onGenerateChange() {
    this.setupRequest.krbadmin_password = '';
    this.setupRequest.krbadmin_password_repeat = '';
    this.setupRequest.stash_password = '';
    this.setupRequest.stash_password_repeat = '';
  }
}
