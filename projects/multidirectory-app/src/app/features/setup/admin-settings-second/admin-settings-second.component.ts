import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';

import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { RequiredWithMessageDirective } from '../../../core/validators/required-with-message.directive';

@Component({
  selector: 'app-admin-settings-second',
  templateUrl: './admin-settings-second.component.html',
  styleUrls: ['./admin-settings-second.component.scss'],
  standalone: true,
  providers: [
    {
      provide: MdFormComponent,
      useExisting: forwardRef(() => AdminSettingsSecondComponent), // replace name as appropriate
      multi: true,
    },
  ],
  imports: [MultidirectoryUiKitModule, RequiredWithMessageDirective, FormsModule, TranslocoPipe],
})
export class AdminSettingsSecondComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  unsubscribe = new Subject<void>();

  constructor(private setupRequestValidatorService: SetupRequestValidatorService) {}

  ngOnInit(): void {
    const domain = this.setupRequest.domain;
    if (!this.setupRequest.user_principal_name)
      this.setupRequest.user_principal_name = `${this.setupRequest.username}@${domain}`;
    if (!this.setupRequest.display_name)
      this.setupRequest.display_name = this.setupRequest.username;
    if (!this.setupRequest.mail) this.setupRequest.mail = this.setupRequest.user_principal_name;
  }

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
}
