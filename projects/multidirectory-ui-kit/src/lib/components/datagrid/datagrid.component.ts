import { NgStyle, NgTemplateOutlet } from '@angular/common';
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
  NgxDatatableModule,
  SelectionType,
  TableColumn,
} from 'ngx-datatable-gimefork';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';
import { Page } from './page';

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
  imports: [NgxDatatableModule, NgStyle, NgTemplateOutlet, DropdownComponent, FormsModule],
})
export class DatagridComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

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
  @Output() pageChanged = new EventEmitter<Page>();
  SelectionType = SelectionType;
  @Input() pageSizes: DropdownOption[] = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
  ];

  _selected: any[] = [];

  get selected(): any[] {
    return this._selected;
  }

  set selected(x: any[]) {
    this._selected = x;
  }

  get size(): number {
    return this.page.size;
  }

  set size(size: number) {
    this.page.size = size;
    this.page.pageNumber = 1;
    if (this.name) {
      localStorage.setItem(`gridSize_${this.name}`, String(size));
    }
    this.pageChanged.emit(this.page);
  }

  private _columns: TableColumn[] = [];

  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() set columns(columns: TableColumn[]) {
    this._columns = columns;
  }

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
