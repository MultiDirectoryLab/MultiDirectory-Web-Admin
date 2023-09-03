import { Component, Input, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'md-spinner',
    styleUrls: ['./spinner.component.scss'],
    templateUrl: './spinner.component.html',
    host: { 'collision-id': 'MdSpinnerComponent' }
})
export class SpinnerComponent implements OnInit{
    @Input() inputText = 'Подождите...';
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