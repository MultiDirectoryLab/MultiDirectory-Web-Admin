import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from 'ngx-datatable-gimefork';
import { Page } from '../datagrid/page';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';

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
  imports: [DropdownComponent, FormsModule, NgxDatatableModule, NgStyle],
})
export class PagerComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  @Input() name = '';
  @Output() pageChanged = new EventEmitter<number>();

  @Input() pagerTitle = 'Размер страницы:';
  @Input() fromTitle = 'из';

  @Input() count = 0;
  @Input() offset = 0;

  pageSizes: DropdownOption[] = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
  ];

  get size(): number {
    return this.page.size;
  }

  set size(size: number) {
    this.page.size = size;
    if (this.name) {
      localStorage.setItem(`pager_${this.name}`, String(limit));
    }
    this.pageChanged.emit(0);
  }

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
