import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
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
} from 'ngx-datatable-gimefork';
import { DropdownOption } from '../dropdown/dropdown.component';

@Component({
  selector: 'md-datagrid',
  templateUrl: './datagrid.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './datagrid.component.scss',
    './../../../../../../node_modules/ngx-datatable-gimefork/index.css',
    './../../../../../../node_modules/ngx-datatable-gimefork/themes/dark.scss',
    './../../../../../../node_modules/ngx-datatable-gimefork/assets/icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridComponent {
  ColumnMode = ColumnMode;
  @ViewChild('datagrid') grid!: DatatableComponent;

  init = false;
  @Input() name = '';
  @Input() pagerTitle = 'Размер страницы:';
  @Input() fromTitle = 'из';
  @Input() emptyMessage = 'Нет данных для отображения...';
  @Input() externalPaging = false;

  @Input() count = 0;
  @Input() offset = 0;
  @Input() limit = 0;
  pageSize = 0;
  @Input() rows: any[] = [];
  @Input() stretchHeight = false;
  @Input() scrollbarV = false;
  @Input() hideFooter = false;
  @Input() headerHeight = 32;
  @Input() controlPanelRef: TemplateRef<any> | null = null;
  @Input() externalSorting = false;
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() doubleclick = new EventEmitter<InputEvent>();
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() contextmenu = new EventEmitter<ContextMenuEvent>();
  @Output() pageChanged = new EventEmitter<number>();

  _selected: any[] = [];
  get selected(): any[] {
    return this._selected;
  }
  set selected(x: any[]) {
    this._selected = x;
  }

  private _columns: TableColumn[] = [];
  @Input() set columns(columns: TableColumn[]) {
    this._columns = columns;
  }
  get columns(): TableColumn[] {
    return this._columns;
  }

  SelectionType = SelectionType;
  @Input() pageSizes: DropdownOption[] = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  select(row: any) {
    if (!row) {
      this.selected = [];
      return;
    }
    this.selected = [row];
    this.cdr.detectChanges();
  }

  toggleSelectedAll(selected: boolean) {
    if (selected) {
      this.selected = Array.from(this.rows);
    } else {
      this.selected = [];
    }
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
    this.cdr.detectChanges();
    this.grid.onWindowResize();
  }

  onPageChange() {
    this.selected = [];
  }

  setPage(page: number) {
    this.selected = [];
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

  onSort(event: SortEvent) {
    this.sort.emit(event);
  }
}

export interface ContextMenuEvent {
  event: MouseEvent;
  type: ContextmenuType;
  content: any;
}

export interface SortEvent {
  sorts: any;
  column: any;
  prevValue: any;
  newValue: any;
}
