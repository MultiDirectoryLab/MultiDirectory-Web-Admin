import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-settings-header',
    templateUrl: './app-settings-header.component.html',
    styleUrls: ['./app-settings-header.component.scss']
}) export class AppSettingsHeaderComponent {
    constructor(private router: Router) {
    }

    close() {
        this.router.navigate(['']);
    }
}