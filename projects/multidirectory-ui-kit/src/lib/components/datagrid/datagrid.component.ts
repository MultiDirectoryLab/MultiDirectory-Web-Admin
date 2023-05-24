import { AfterViewInit, ChangeDetectorRef, ElementRef, HostListener, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { Component } from "@angular/core";
import { ColumnMode, DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: 'md-datagrid',
    templateUrl: './datagrid.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './datagrid.component.scss', 
        './../../../../../../node_modules/@swimlane/ngx-datatable/index.css',
        './../../../../../../node_modules/@swimlane/ngx-datatable/themes/material.scss',
        './../../../../../../node_modules/@swimlane/ngx-datatable/assets/icons.css',
    ]
})
export class DatagridComponent implements AfterViewInit {
    ColumnMode = ColumnMode;
    @ViewChild('datagrid') grid!: DatatableComponent;

    init = false;
    @Input() rows: any[] = [];
    @Input() columns: TableColumn[] = [];

    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        setTimeout(_ => {this.init = true;}, 0)
        this.cdr.detectChanges();
    }
    @HostListener('window:resize', ['$event'])
    onResize($event: Event) {
        if(!this.grid) {
            return;
        }
        this.init = false;
        this.cdr.detectChanges();
        this.init = true;
    }
}