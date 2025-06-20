import {
  AfterViewInit,
  Component,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/api/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { AutofocusDirective, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-settings-second',
  templateUrl: './admin-settings-second.component.html',
  styleUrls: ['./admin-settings-second.component.scss'],
  providers: [
    {
      provide: MdFormComponent,
      useExisting: forwardRef(() => AdminSettingsSecondComponent), // replace name as appropriate
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
  ],
})
export class AdminSettingsSecondComponent implements OnInit, AfterViewInit, OnDestroy {
  private setupRequestValidatorService = inject(SetupRequestValidatorService);

  @Input() setupRequest!: SetupRequest;
  readonly form = viewChild.required<MdFormComponent>('form');
  unsubscribe = new Subject<void>();

  ngOnInit(): void {
    const domain = this.setupRequest.domain;
    if (!this.setupRequest.user_principal_name)
      this.setupRequest.user_principal_name = `${this.setupRequest.username}@${domain}`;
    if (!this.setupRequest.display_name)
      this.setupRequest.display_name = this.setupRequest.username;
    if (!this.setupRequest.mail) this.setupRequest.mail = this.setupRequest.user_principal_name;
  }

  ngAfterViewInit(): void {
    const form = this.form();
    this.setupRequestValidatorService.stepValid(form.valid);
    this.setupRequestValidatorService.invalidateRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
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
}
