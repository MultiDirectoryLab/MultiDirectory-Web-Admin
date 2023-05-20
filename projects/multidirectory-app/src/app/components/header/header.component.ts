import { Component } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    constructor(private app: AppSettingsService) {}


    test() {
        alert('test');
    }

    toggleLeftPane() {
        this.app.toggleLeftPane();
    }
}