import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-backend-not-responded',
    templateUrl: 'backend-not-responded.component.html',
    styleUrls: [ './backend-not-responded.component.scss' ]
}) export class BackendNotRespondedComponent {

    constructor(private router: Router) {}
    retry() {
        this.router.navigate(['/']);
    }
}