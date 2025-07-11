import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { merge, Subject, Subscription, takeUntil } from 'rxjs';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'md-tab-pane',
  templateUrl: './tab-pane.component.html',
  styleUrls: ['./tab-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabPaneComponent implements AfterViewInit, OnDestroy {
  private renderer = inject(Renderer2);

  @Output() tabChanged = new EventEmitter<TabComponent>();
  @ContentChildren(TabComponent, { descendants: true }) tabs!: QueryList<TabComponent>;
  unsubscribe = new Subject();
  selectedElementRef: ElementRef<any> | null = null;
  lastSubscription: Subscription | null = null;

  ngAfterViewInit(): void {
    this.tabs.changes.pipe(takeUntil(this.unsubscribe)).subscribe((tab) => {
      this.trackSelection();
    });
    this.trackSelection();
  }

  select(tab: TabComponent) {
    this.tabs.forEach((x) => {
      if (x !== tab) {
        x.isSelected = false;
        if (x.el) {
          this.renderer.setStyle(x.el, 'display', 'none');
        }
      }
    });
    setTimeout(() => (tab.isSelected = true));
    if (tab.el) {
      this.renderer.setStyle(tab.el, 'display', 'block');
    }
    this.tabChanged.emit(tab);
  }

  trackSelection() {
    if (this.lastSubscription) {
      this.lastSubscription.unsubscribe();
    }
    const selections = this.tabs.map((x) => x.selected.asObservable());
    this.lastSubscription = merge(...selections)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.select.bind(this));
    const first = this.tabs.first;
    if (!!first) {
      this.select(first);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
