import { OnInit, Component } from '@angular/core';
import { AppSettingsService } from '@services/app-settings.service';
import { DropdownOption } from 'multidirectory-ui-kit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multidirectory-settings',
  templateUrl: './multidirectory-settings.component.html',
  styleUrls: ['./multidirectory-settings.component.scss'],
})
export class MultidirectorySettingsComponent implements OnInit {
  constructor(
    private settings: AppSettingsService,
    private router: Router,
  ) {}
  ngOnInit(): void {}

  set selectedLanguage(value: string) {
    this.settings.language = value;
  }
  get selectedLanguage(): string {
    return this.settings.language;
  }

  lanugages: DropdownOption[] = [
    { title: 'Russian', value: 'ru-RU' },
    { title: 'English', value: 'en-US' },
  ];
  apply() {
    window.location.reload();
  }
}
