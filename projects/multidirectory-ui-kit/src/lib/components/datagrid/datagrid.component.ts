import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Component } from "@angular/core";
import { ColumnMode, ContextmenuType, DatatableComponent, SelectionType, TableColumn } from "@swimlane/ngx-datatable";

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
    @Input() rows: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Output() dblclick = new EventEmitter<InputEvent>();
    @Output() contextmenu = new EventEmitter<ContextMenuEvent>();

    selected: any[] = [];
    SelectionType = SelectionType;
    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
    }
    
    select(row: any) {
        this.selected = [ row ];
        this.cdr.detectChanges();
    }
    onSelect({ selected }: { selected: any }) {
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
}

export interface ContextMenuEvent { 
    event: MouseEvent; 
    type: ContextmenuType; 
    content: any;
}