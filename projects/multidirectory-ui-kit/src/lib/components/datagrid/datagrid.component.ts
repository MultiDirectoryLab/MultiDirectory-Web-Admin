import { CommonModule, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
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
  DataTableControlPanelDirective,
  DatatableFooterDirective,
  DataTableFooterTemplateDirective,
  DataTablePagerComponent,
  PageEvent,
  SelectEvent,
  SelectionType,
  TableColumn,
} from 'ngx-datatable-gimefork';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';

@Component({
  selector: 'md-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: [
    './datagrid.component.scss',
    './../../styles/ngx-datatable/index.css',
    './../../styles/ngx-datatable/dark.scss',
    './../../styles/ngx-datatable/icons.css',
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    NgStyle,
    NgTemplateOutlet,
    DatatableComponent,
    DataTablePagerComponent,
    DatatableFooterDirective,
    DataTableFooterTemplateDirective,
    DataTableControlPanelDirective,
    DropdownComponent,
  ],
})
export class DatagridComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly allowedPageSizes = [20, 50, 100];
  pageSizes: DropdownOption[] = this.allowedPageSizes.map(
    (size) =>
      new DropdownOption({
        title: String(size),
        value: size,
      }),
  );
  selectedPageSize = this.pageSizes[0];

  readonly ColumnMode = ColumnMode;
  @ViewChild('datagrid') grid!: DatatableComponent;

  @Input() name = '';
  @Input() pagerTitle = 'Размер страницы:';
  @Input() fromTitle = 'из';
  @Input() emptyMessage = 'Нет данных для отображения...';

  @Input() externalPaging = false;
  @Input() externalSorting = true;
  @Input() scrollbarV = false;
  @Input() hideFooter = false;

  @Input() headerHeight = 32;
  @Input() controlPanelRef: TemplateRef<any> | null = null;

  private _rows: any[] = [];
  displayRows: any[] = [];

  @Input()
  set rows(value: any[]) {
    this._rows = value ?? [];
    this.displayRows = [...this._rows];
  }

  get rows(): any[] {
    return this._rows;
  }

  @Input() selectionType = SelectionType.multi;

  private _limit = this.allowedPageSizes[0];
  @Input()
  set limit(value: number) {
    const normalized = this.allowedPageSizes.includes(value) ? value : this.allowedPageSizes[0];

    this._limit = normalized;
    this.syncSelectedPageSize();
  }
  get limit(): number {
    return this._limit;
  }

  private _offset = 0;
  @Input()
  set offset(value: number) {
    this._offset = value;
  }
  get offset(): number {
    return this._offset;
  }

  private _total = 1;
  @Input()
  set total(value: number) {
    this._total = value;
  }
  get total(): number {
    return this._total;
  }

  private _columns: TableColumn[] = [];
  @Input()
  set columns(value: TableColumn[]) {
    this._columns = value;
  }
  get columns(): TableColumn[] {
    return this._columns;
  }

  @Output() limitChange = new EventEmitter<number>();
  @Output() offsetChange = new EventEmitter<number>();
  @Output() totalChange = new EventEmitter<number>();

  @Output() sort = new EventEmitter<SortEvent>();
  @Output() doubleclick = new EventEmitter<InputEvent>();
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() contextmenu = new EventEmitter<ContextMenuEvent>();

  sorts: any[] = [];

  _selected: any[] = [];
  get selected(): any[] {
    return this._selected;
  }
  set selected(x: any[]) {
    this._selected = x;
  }

  get pageOffset(): number {
    return this.offset / this.limit;
  }

  onPageSizeChange(option: number): void {
    if (option === this.limit) {
      return;
    }

    this.selectedPageSize = { title: String(option), value: option };
    this.limit = option;
    this.limitChange.emit(option);
  }

  private syncSelectedPageSize(): void {
    const option = this.pageSizes.find((x) => x.value === this.limit);

    if (option) {
      this.selectedPageSize = option;
    }
  }

  select(row: any): void {
    this.selected = row ? [row] : [];
    this.cdr.detectChanges();
  }

  toggleSelectedAll(selected: boolean): void {
    this.selected = selected ? [...this.displayRows] : [];
  }

  onSelect(event: SelectEvent<any>): void {
    this.selected = [...event.selected];
    this.selectionChanged.emit(this.selected);
  }

  onActivate(event: any): void {
    const checkboxClick = event.column?.checkboxable && event.event.target.localName === 'input';

    if (event.type === 'dblclick' && !checkboxClick) {
      event.event.preventDefault();
      event.event.stopPropagation();
      this.doubleclick.emit(event);
    }

    if (event.type === 'click' && checkboxClick) {
      this.selected.push(event.row);
    }

    this.cdr.detectChanges();
  }

  onPageChange(page: PageEvent): void {
    this.selected = [];

    const newOffset = page.offset * page.pageSize;

    if (this.offset !== newOffset) {
      this.offset = newOffset;
      this.offsetChange.emit(newOffset);
    }

    if (this.limit !== page.pageSize) {
      this.limit = page.pageSize;
      this.limitChange.emit(page.pageSize);
    }

    if (page.count && this.total !== page.count) {
      this.total = page.count;
      this.totalChange.emit(page.count);
    }
  }

  onSort(event: any): void {
    const sort = event.sorts?.[0];
    if (!sort) return;

    this.sorts = [...event.sorts];
    const pipe = this._columns.find((col) => col.prop === sort.prop)?.pipe;

    this.displayRows = [...this.displayRows].sort((a, b) => {
      let valueA = String(this.getValue(a, sort.prop)).trim();
      let valueB = String(this.getValue(b, sort.prop)).trim();
      if (pipe) {
        valueA = pipe?.transform(Number(valueA));
        valueB = pipe?.transform(Number(valueB));
      }

      const result = this.naturalCompare(valueA, valueB);

      return sort.dir === 'desc' ? -result : result;
    });

    this.cdr.detectChanges();
  }

  onTableContextMenu(event: ContextMenuEvent): void {
    event.event.preventDefault();
    event.event.stopPropagation();

    this.contextmenu.emit(event);
    this.cdr.detectChanges();
  }

  onTableResize(): void {
    this.cdr.detectChanges();
    this.grid?.onWindowResize();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.displayRows.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      let index = this.displayRows.findIndex((x) => x === this.selected[0]);

      if (event.key === 'ArrowDown') {
        index = (index + 1) % this.displayRows.length;
      } else {
        index = index <= 0 ? this.displayRows.length - 1 : index - 1;
      }

      this.select(this.displayRows[index]);
    }

    if (event.key === 'Enter') {
      const dblClickEvent = Object.assign(new InputEvent(''), {
        row: this.selected[0],
      });

      this.doubleclick.emit(dblClickEvent);
    }
  }

  @HostListener('window:resize')
  onResize(): void {}

  private naturalCompare(a: string, b: string): number {
    const partsA = a.match(/\d+|\D+/g) || [];
    const partsB = b.match(/\d+|\D+/g) || [];

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] ?? '';
      const partB = partsB[i] ?? '';

      const isNumA = /^\d+$/.test(partA);
      const isNumB = /^\d+$/.test(partB);

      if (isNumA && isNumB) {
        const diff = Number(partA) - Number(partB);
        if (diff !== 0) return diff;
      } else {
        const diff = partA.localeCompare(partB, undefined, {
          sensitivity: 'base',
        });

        if (diff !== 0) return diff;
      }
    }

    return 0;
  }

  private getValue(row: any, prop: string): any {
    return typeof row === 'string' ? row : (row?.[prop] ?? '');
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
