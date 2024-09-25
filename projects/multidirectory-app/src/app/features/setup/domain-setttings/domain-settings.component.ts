import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';

@Component({
  selector: 'app-domain-settings',
  templateUrl: './domain-settings.component.html',
  styleUrls: ['./domain-settings.component.scss'],
})
export class DomainSettingsComponent implements AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;
  name = new FormControl('');
  @ViewChild('form') form!: MdFormComponent;

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
