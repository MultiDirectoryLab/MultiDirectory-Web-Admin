import { Component } from '@angular/core';
import { AppSettingsService } from '@services/app-settings.service';
import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multidirectory-settings',
  templateUrl: './multidirectory-settings.component.html',
  styleUrls: ['./multidirectory-settings.component.scss'],
  standalone: true,
  imports: [TranslocoDirective, MultidirectoryUiKitModule, FormsModule],
})
export class MultidirectorySettingsComponent {
  lanugages: DropdownOption[] = [
    { title: 'Russian', value: 'ru-RU' },
    { title: 'English', value: 'en-US' },
  ];

  constructor(
    private settings: AppSettingsService,
    private router: Router,
  ) {}

  get selectedLanguage(): string {
    return this.settings.language;
  }

  set selectedLanguage(value: string) {
    this.settings.language = value;
  }

  apply() {
    window.location.reload();
  }
}
