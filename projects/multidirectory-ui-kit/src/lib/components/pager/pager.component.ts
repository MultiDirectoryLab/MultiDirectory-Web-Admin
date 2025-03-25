import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DropdownOption } from '../dropdown/dropdown.component';

@Component({
  selector: 'md-pager',
  templateUrl: './pager.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './pager.component.scss',
    '../datagrid/datagrid.component.scss',
    './../../../../../../node_modules/ngx-datatable-gimefork/index.css',
    './../../../../../../node_modules/ngx-datatable-gimefork/themes/material.scss',
    './../../../../../../node_modules/ngx-datatable-gimefork/assets/icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerComponent implements AfterViewInit {
  @Input() name = '';
  @Output() pageChanged = new EventEmitter<number>();

  @Input() pagerTitle = 'Размер страницы:';
  @Input() fromTitle = 'из';

  @Input() count = 0;
  @Input() offset = 0;
  private _limit = 0;

  pageSizes: DropdownOption[] = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
  ];

  @Input() set limit(limit: number) {
    this._limit = limit;
    if (this.name) {
      localStorage.setItem(`pager_${this.name}`, String(limit));
    }
    this.pageChanged.emit(0);
  }
  get limit(): number {
    return this._limit;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.name) {
      const limit = Number(localStorage.getItem(`pager_${this.name}`));
      if (!isNaN(limit) && limit > 0) {
        this._limit = limit;
        this.cdr.detectChanges();
      }
    }
  }
  onPageChanged(event: any) {
    this.offset = 0;
    this.pageChanged.emit(this.offset);
  }
}
