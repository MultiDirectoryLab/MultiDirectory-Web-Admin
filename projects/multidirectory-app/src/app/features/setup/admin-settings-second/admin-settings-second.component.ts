import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SetupService } from '@services/setup.service';
import { MdFormComponent } from 'multidirectory-ui-kit';
import { SetupRequest } from '@models/setup/setup-request';

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
})
export class AdminSettingsSecondComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  unsubscribe = new Subject<void>();

  constructor(private setup: SetupService) {}

  ngOnInit(): void {
    const domain = this.setupRequest.domain;
    if (!this.setupRequest.user_principal_name)
      this.setupRequest.user_principal_name = `${this.setupRequest.username}@${domain}`;
    if (!this.setupRequest.display_name)
      this.setupRequest.display_name = this.setupRequest.username;
    if (!this.setupRequest.mail) this.setupRequest.mail = this.setupRequest.user_principal_name;
  }

  ngAfterViewInit(): void {
    this.setup.stepValid(this.form.valid);
    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form.validate();
    });
    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
      this.setup.stepValid(valid);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
