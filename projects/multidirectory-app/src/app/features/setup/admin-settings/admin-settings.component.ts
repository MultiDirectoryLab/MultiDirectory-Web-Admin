import { AfterViewInit, Component, Input, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import { MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { SetupService } from '@services/setup.service';
import { Subject, takeUntil } from 'rxjs';
import { SetupRequest } from '@models/setup/setup-request';

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
})
export class AdminSettingsComponent implements AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  @ViewChild('passwordInput') passwordInput!: TextboxComponent;
  @ViewChild('repeatPassword') repeatPassword!: TextboxComponent;

  unsubscribe = new Subject<void>();

  constructor(private setup: SetupService) {}

  ngAfterViewInit(): void {
    this.setup.stepValid(this.form.valid);

    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form.validate();
    });

    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
      this.setup.stepValid(valid);
    });
  }

  checkModel() {
    this.form.validate();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
