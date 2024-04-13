import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-display-error',
    templateUrl: 'display-error.component.html',
    styleUrls: [ './display-error.component.scss' ]
}) export class DisplayErrorComponent implements OnInit {
    errorMessage = 'Some error has occured, please, check the Multidirectory Log File';
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        if(this.activatedRoute.snapshot.data.message) {
            this.errorMessage = this.activatedRoute.snapshot.data.message;
        }
    }

    retry() {
        this.router.navigate(['/']);
    }
}