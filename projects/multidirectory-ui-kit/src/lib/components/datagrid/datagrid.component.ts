import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Component } from '@angular/core';
import {
  ColumnMode,
  ContextmenuType,
  DatatableComponent,
  SelectionType,
  TableColumn,
} from '@swimlane/ngx-datatable';
import { DropdownOption } from '../dropdown/dropdown.component';

export class Page {
  totalElements: number = 0;
  pageNumber: number = 1;
  size: number = 10;

  get pageOffset(): number {
    return this.pageNumber - 1;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridComponent implements AfterViewInit {
  ColumnMode = ColumnMode;
  @ViewChild('datagrid') grid!: DatatableComponent;

  init = false;
  @Input() name = '';
  @Input() pagerTitle = 'Размер страницы:';
  @Input() fromTitle = 'из';
  @Input() emptyMessage = 'Нет данных для отображения...';
  @Input() externalPaging = false;
  @Input() page: Page = new Page({});
  @Input() rows: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() stretchHeight = false;
  @Input() scrollbarV = false;
  @Input() hideFooter = false;
  @Output() doubleclick = new EventEmitter<InputEvent>();
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() contextmenu = new EventEmitter<ContextMenuEvent>();
  @Output() pageChanged = new EventEmitter<Page>();
  _selected: any[] = [];
  get selected(): any[] {
    return this._selected;
  }
  set selected(x: any[]) {
    this._selected = x;
  }

  set size(size: number) {
    this.page.size = size;
    this.page.pageNumber = 1;
    if (this.name) {
      localStorage.setItem(`gridSize_${this.name}`, String(size));
    }
    this.pageChanged.emit(this.page);
  }
  get size(): number {
    return this.page.size;
  }

  SelectionType = SelectionType;
  @Input() pageSizes: DropdownOption[] = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
  ];
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.page.size = this.pageSizes?.[0]?.value ?? this.page.size;
    if (this.name) {
      const size = Number(localStorage.getItem(`gridSize_${this.name}`));
      if (!isNaN(size) && size > 0 && this.pageSizes.findIndex((x) => x.value == size) > -1) {
        this.page.size = size;
        this.cdr.detectChanges();
      }
    }
  }

  select(row: any) {
    if (!row) {
      this.selected = [];
      return;
    }
    this.selected = [row];
    this.cdr.detectChanges();
  }

  onActivate(event: any) {
    if (event.type === 'dblclick') {
      this.doubleclick.emit(event);
    } else if (event.type === 'click') {
      this.selectionChanged.emit(this.selected);
    }
    this.cdr.detectChanges();
  }

  redraw() {
    if (!this.grid) {
      return;
    }
    this.grid.recalculate();
  }

  onTableContextMenu(contextMenuEvent: ContextMenuEvent) {
    contextMenuEvent.event.stopPropagation();
    contextMenuEvent.event.preventDefault();
    this.contextmenu.emit(contextMenuEvent);
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: Event) {
    if (!this.grid) {
      return;
    }
  }

  onTableResize() {
    this.grid.recalculateColumns();
  }

  onPageChange(pageInfo: { offset: number; pageSize: number; limit: number; count: number }) {
    this.selected = [];
    this.page = new Page({
      pageNumber: pageInfo.offset + 1,
      size: pageInfo.pageSize,
      totalElements: pageInfo.count,
    });
    this.pageChanged.emit(this.page);
  }
  setPage(page: Page) {
    this.selected = [];
    if (this.page == page) {
      return;
    }
    this.page = new Page(page);
    this.grid.offset = this.page.pageOffset;
    this.grid.calcPageSize();
  }

  onFocus($event: FocusEvent) {}

  onKeyDown(event: KeyboardEvent) {
    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
      let index = this.rows.findIndex((x) => this.selected[0] == x);
      if (event.key == 'ArrowDown') {
        index = (index + 1) % this.rows.length;
      }
      if (event.key == 'ArrowUp') {
        index -= 1;
        if (index < 0) {
          index = this.rows.length - 1;
        }
      }
      this.select(this.rows[index]);
    }
    if (event.key == 'Enter') {
      let event = new InputEvent('');
      event = Object.assign(event, { row: this.selected[0] });
      this.doubleclick.emit(event);
    }
  }

  getRowHeight(row: any) {
    return row?.height ?? 24;
  }

  resetScroll() {
    this.grid?.bodyComponent?.scroller?.setOffset(0);
  }
}

export interface ContextMenuEvent {
  event: MouseEvent;
  type: ContextmenuType;
  content: any;
}
