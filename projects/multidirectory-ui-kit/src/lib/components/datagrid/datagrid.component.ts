import { CommonModule, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ColumnMode,
  ContextmenuType,
  DatatableComponent,
  PageEvent,
  SelectionType,
  TableColumn,
  DataTablePagerComponent,
  DataTableFooterTemplateDirective,
  DatatableFooterDirective,
  SelectEvent,
  DataTableControlPanelDirective,
} from 'ngx-datatable-gimefork';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';

@Component({
  selector: 'md-datagrid',
  templateUrl: './datagrid.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './datagrid.component.scss',
    './../../styles/ngx-datatable/index.css',
    './../../styles/ngx-datatable/dark.scss',
    './../../styles/ngx-datatable/icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgStyle,
    NgTemplateOutlet,
    DatatableComponent,
    DataTablePagerComponent,
    DatatableFooterDirective,
    DataTableFooterTemplateDirective,
    DataTableControlPanelDirective,
    DropdownComponent,
    FormsModule,
    CommonModule,
  ],
})
export class DatagridComponent {
  private cdr = inject(ChangeDetectorRef);

  ColumnMode = ColumnMode;

  @ViewChild('datagrid') grid!: DatatableComponent;

  init = false;
  @Input() name = '';
  @Input() pagerTitle = 'Размер страницы:';
  @Input() fromTitle = 'из';
  @Input() emptyMessage = 'Нет данных для отображения...';
  @Input() externalPaging = false;

  pageSizes: DropdownOption[] = [
    { title: '20', value: 20 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];

  private _limit = this.pageSizes[0].value;
  get limit() {
    return this._limit;
  }
  @Input() set limit(value: number) {
    this._limit = value;
    this.limitChange.emit(value);
  }
  @Output() limitChange = new EventEmitter<number>();

  private _offset = 0;
  @Input() set offset(offset: number) {
    this._offset = offset;
  }
  get offset() {
    return this._offset;
  }
  get pageOffset() {
    return this._offset / this.limit;
  }
  @Output() offsetChange = new EventEmitter<number>();

  private _total = 1;
  @Input() set total(total: number) {
    this._total = total;
  }
  get total(): number {
    return this._total;
  }
  @Output() totalChange = new EventEmitter<number>();

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

  onSelect(selectEvent: SelectEvent<any>) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selectEvent.selected);
    this.selectionChanged.emit(this.selected);
  }

  onActivate(event: any) {
    const onCheckboxClick = event.column?.checkboxable && event.event.target.localName == 'input';
    if (event.type === 'dblclick' && !onCheckboxClick) {
      event.event.preventDefault();
      event.event.stopPropagation();
      this.doubleclick.emit(event);
    } else if (event.type === 'click' && onCheckboxClick) {
      this.selected.push(event.row);
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

  onPageChange(pageInfo: PageEvent) {
    this.selected = [];
    if (this.offset != pageInfo.offset) {
      this.offset = pageInfo.offset * pageInfo.pageSize;
      this.offsetChange.emit(pageInfo.offset * pageInfo.pageSize);
    }

    if (this.limit != pageInfo.pageSize) {
      this.limit = pageInfo.pageSize;
      this.limitChange.emit(pageInfo.pageSize);
    }
    if (this.total != pageInfo.count && pageInfo.count) {
      this.total = pageInfo.count;
      this.totalChange.emit(pageInfo.count);
    }
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
