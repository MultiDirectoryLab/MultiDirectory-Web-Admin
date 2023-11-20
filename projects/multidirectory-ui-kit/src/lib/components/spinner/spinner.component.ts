import { Component, Input, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'md-spinner',
    styleUrls: ['./spinner.component.scss'],
    templateUrl: './spinner.component.html',
    host: { 'collision-id': 'MdSpinnerComponent' }
})
export class SpinnerComponent implements OnInit{
    @Input() spinnerText = 'Please, wait...';
    @Input() name = 'primary';
    @Input() fullscreen = false;
    constructor(private spinner: NgxSpinnerService) {}
    ngOnInit(): void {
    }

    show() {
        this.spinner.show(this.name);
    }

    hide() {
        this.spinner.hide(this.name);
    }
}