import { Component } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";

@Component({
    selector: 'app-settings',
    templateUrl: './app-settings.component.html',
    styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent {
    constructor(private app: AppSettingsService) {
        this.app.setNavigationalPanelVisiblity(false);
    }
}