import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Component } from "@angular/core";
import { ColumnMode, ContextmenuType, DatatableComponent, SelectionType, TableColumn } from "@swimlane/ngx-datatable";

export class Page {
    totalElements: number = 0;
    pageNumber: number = 1;
    size: number = 10;

    get pageOffset(): number {
        return Math.floor(this.pageNumber / this.size)
    }
    constructor(obj?: Partial<Page>) {
        Object.assign(this, obj ?? {});
    }
}

@Component({
    selector: 'md-datagrid',
    templateUrl: './datagrid.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './datagrid.component.scss', 
        './../../../../../../node_modules/@swimlane/ngx-datatable/index.css',
        './../../../../../../node_modules/@swimlane/ngx-datatable/themes/material.scss',
        './../../../../../../node_modules/@swimlane/ngx-datatable/assets/icons.css',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements AfterViewInit {
    ColumnMode = ColumnMode;
    @ViewChild('datagrid') grid!: DatatableComponent;

    init = false;
    @Input() externalPaging = false;
    @Input() page: Page = new Page({});
    @Input() rows: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Output() dblclick = new EventEmitter<InputEvent>();
    @Output() contextmenu = new EventEmitter<ContextMenuEvent>();
    @Output() pageChanged = new EventEmitter<Page>();
    _selected: any[] = [];
    get selected(): any[] {
        return this._selected;
    }
    set selected(x: any[]) {
        this._selected = x;
    }
    SelectionType = SelectionType;
    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.setPage(new Page());
    }
    
    select(row: any) {
        this.selected = [ row ];
        this.cdr.detectChanges();
    }

    onActivate(event: any) {
        if (event.type === 'dblclick') {
            this.dblclick.emit(event);
        }
        this.cdr.detectChanges();
    }

    onTableContextMenu(contextMenuEvent:  ContextMenuEvent) {
        contextMenuEvent.event.stopPropagation();
        contextMenuEvent.event.preventDefault();
        this.contextmenu.emit( contextMenuEvent );
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

    onPageChange(pageInfo: { offset: number, pageSize: number, limit: number, count: number }) {
        this.page = new Page({
            pageNumber: (pageInfo.offset) + 1,
            size: pageInfo.pageSize,
            totalElements: pageInfo.count
        });
        this.pageChanged.emit(this.page);
    }
    setPage(page: Page) {
        this.page = page;
        this.pageChanged.emit(this.page);
    }
}

export interface ContextMenuEvent { 
    event: MouseEvent; 
    type: ContextmenuType; 
    content: any;
}