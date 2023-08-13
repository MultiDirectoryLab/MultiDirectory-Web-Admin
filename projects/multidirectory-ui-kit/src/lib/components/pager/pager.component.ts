import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { DropdownOption } from "../dropdown/dropdown.component";
import { Page } from "../datagrid/datagrid.component";

@Component({
    selector: 'md-pager]',
    templateUrl: './pager.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './pager.component.scss', 
        '../datagrid/datagrid.component.scss', 
        './../../../../../../node_modules/@swimlane/ngx-datatable/index.css',
        './../../../../../../node_modules/@swimlane/ngx-datatable/themes/material.scss',
        './../../../../../../node_modules/@swimlane/ngx-datatable/assets/icons.css',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerComponent implements AfterViewInit {
    @Input() name = ''; 
    @Input() page: Page = new Page({});
    @Output() pageChanged = new EventEmitter<Page>();

    curPage = 0;
    pageSize = 0;
    rowCount = 0;
    pageSizes: DropdownOption[] = [ 
        { title: '5', value: 5 },
        { title: '10', value: 10 },
        { title: '15', value: 15 },
        { title: '20', value: 20 }
    ];
    set size(size: number) {
        this.page.size = size;
        if(this.name) {
            localStorage.setItem(`pager_${this.name}`, String(size));
        }
        this.pageChanged.emit(this.page);
     }
     get size(): number {
         return this.page.size;
     }
    constructor(private cdr: ChangeDetectorRef) {}
    ngAfterViewInit(): void {
    }

    onPageChanged(event: any) {
        this.page.pageNumber = event.page;
        this.updatePager();
        this.pageChanged.emit(this.page);
    }
    
    updatePager() {
        this.curPage = this.page.pageNumber;
        this.pageSize = this.page.size;
        this.rowCount = this.page.totalElements;
        this.cdr.detectChanges();
    }
}