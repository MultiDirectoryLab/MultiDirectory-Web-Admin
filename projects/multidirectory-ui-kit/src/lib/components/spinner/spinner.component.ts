import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'md-spinner',
    styleUrls: ['./spinner.component.scss'],
    templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit{
    constructor(private spinner: NgxSpinnerService) {}
    ngOnInit(): void {
    }


    show() {
        this.spinner.show();
    }

    hide() {
        this.spinner.hide();
    }
}