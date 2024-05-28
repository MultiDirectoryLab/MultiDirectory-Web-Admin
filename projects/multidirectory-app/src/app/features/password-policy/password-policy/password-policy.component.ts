import { Component, OnInit, ViewChild } from '@angular/core';
import { MdFormComponent } from 'multidirectory-ui-kit';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { ActivatedRoute } from '@angular/router';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html',
  styleUrls: ['./password-policy.component.scss'],
})
export class PasswordPolicyComponent implements OnInit {
  @ViewChild('form') form!: MdFormComponent;
  passwordPolicy = new PasswordPolicy();

  constructor(
    private activatedRoute: ActivatedRoute,
    private windows: AppWindowsService,
    private api: MultidirectoryApiService,
  ) {}

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot.params['id'];
    this.windows.showSpinner();
    this.api.getPasswordPolicy().subscribe({
      next: (x) => {
        this.passwordPolicy = x;
        this.windows.hideSpinner();
      },
      error: (err) => {
        this.windows.hideSpinner();
      },
    });
  }

  close() {}

  save() {
    this.form.validate();
    this.windows.showSpinner();
    this.api.savePasswordPolicy(this.passwordPolicy).subscribe({
      complete: () => {
        this.windows.hideSpinner();
      },
    });
  }
}
