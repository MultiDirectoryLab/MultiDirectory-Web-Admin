import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';

import { TranslocoPipe } from '@jsverse/transloco';
import { DomainFormatValidatorDirective } from '../../../core/validators/domainformat.directive';
import { RequiredWithMessageDirective } from '../../../core/validators/required-with-message.directive';

@Component({
  selector: 'app-domain-settings',
  templateUrl: './domain-settings.component.html',
  styleUrls: ['./domain-settings.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    DomainFormatValidatorDirective,
    RequiredWithMessageDirective,
    FormsModule,
    TranslocoPipe,
  ],
})
export class DomainSettingsComponent implements AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  name = new FormControl('');
  unsubscribe = new Subject<void>();

  constructor(private setupRequestValidatorService: SetupRequestValidatorService) {}

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
