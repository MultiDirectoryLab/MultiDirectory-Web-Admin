import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupService } from '@services/setup.service';
import { MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-kdc-settings',
  templateUrl: './kdc-settings.component.html',
  styleUrls: ['./kdc-settings.component.scss'],
})
export class KdcSettingsComponent implements AfterViewInit {
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
    this.form.validate(true);
  }
}
