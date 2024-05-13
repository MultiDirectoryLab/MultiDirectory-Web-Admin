import { Component, Input, OnInit } from '@angular/core';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-password-conditions',
  templateUrl: './password-conditions.component.html',
  styleUrls: ['./password-conditions.component.scss'],
})
export class PasswordConditionsComponent implements OnInit {
  minimumPasswordLength = 7;
  passwordMustMeetComplexityRequirements = true;

  checkPasswordComplexity = false;
  checkPasswordMinimalLength = false;

  @Input() set currentPassword(password: string) {
    var hasUpperCase = /[A-ZА-Я]/.test(password);
    var hasLowerCase = /[a-zа-я]/.test(password);
    var hasNumbers = /\d/.test(password);
    this.checkPasswordComplexity = hasLowerCase && hasNumbers && hasUpperCase;
    this.checkPasswordMinimalLength = password.length >= this.minimumPasswordLength;
  }

  constructor(private api: MultidirectoryApiService) {}
  ngOnInit(): void {
    this.api
      .getPasswordPolicy()
      .pipe(take(1))
      .subscribe((x) => {
        console.log(x);
        this.minimumPasswordLength = x.minimumPasswordLength;
        this.passwordMustMeetComplexityRequirements = x.passwordMustMeetComplexityRequirements;
      });
  }
}
