import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'md-spinner',
    styleUrls: ['./spinner.component.scss'],
    templateUrl: './spinner.component.html',
    host: { 'collision-id': 'MdSpinnerComponent' }
})
export class SpinnerComponent implements OnInit{
    @Input() inputText = 'Подождите...';
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