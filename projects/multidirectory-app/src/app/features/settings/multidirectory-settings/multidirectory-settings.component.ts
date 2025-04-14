import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { ButtonComponent, DropdownComponent, DropdownOption } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-multidirectory-settings',
  templateUrl: './multidirectory-settings.component.html',
  styleUrls: ['./multidirectory-settings.component.scss'],
  imports: [TranslocoDirective, DropdownComponent, FormsModule, ButtonComponent],
})
export class MultidirectorySettingsComponent {
  private settings = inject(AppSettingsService);

  lanugages: DropdownOption[] = [
    { title: 'Russian', value: 'ru-RU' },
    { title: 'English', value: 'en-US' },
  ];

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
