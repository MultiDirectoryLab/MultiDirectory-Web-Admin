import { CdkDrag, CdkDragDrop, CdkDragEnd, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import {
  CheckboxComponent,
  DropdownMenuComponent,
  Page,
  PagerComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { BaseViewComponent } from '../base-view.component';
import { GridItemComponent } from './grid-item/grid-item.component';

@Component({
  selector: 'app-icon-view',
  templateUrl: './icon-view.component.html',
  styleUrls: ['./icon-view.component.scss'],
  providers: [{ provide: BaseViewComponent, useExisting: forwardRef(() => IconViewComponent) }],
  imports: [
    NgClass,
    CdkDrag,
    GridItemComponent,
    PagerComponent,
    TranslocoPipe,
    DropdownMenuComponent,
    CheckboxComponent,
    FormsModule,
  ],
})
export class IconViewComponent extends BaseViewComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private ldapLoader = inject(LdapEntryLoader);
  private navigation = inject(AppNavigationService);
  private route = inject(ActivatedRoute);
  toast = inject(ToastrService);
  readonly big = input(false);
  readonly gridItems = viewChildren(GridItemComponent);
  readonly gridDrags = viewChildren(CdkDrag);
  readonly grid = viewChild.required<ElementRef<HTMLElement>>('grid');
  readonly gridMenu = viewChild.required<DropdownMenuComponent>('gridMenu');
  readonly pager = viewChild.required<PagerComponent>('pager');
  items: LdapEntryNode[] = [];
  alignItems = true;
  page = new Page();

  ngAfterViewInit(): void {
    this.navigation.reload();
  }

  override updateContent() {
    this.ldapLoader
      .getContent(this.route.snapshot.queryParams['distinguishedName'])
      .pipe(take(1))
      .subscribe((rows) => {
        this.items = rows;
        this.pager().updatePager();
        this.cdr.detectChanges();
      });
  }

  override getSelected(): LdapEntryNode[] {
    return this.items.filter((x) => x.selected);
  }

  override setSelected(selected: LdapEntryNode[]): void {
    this.items.forEach((i) => (i.selected = false));
    selected.filter((i) => !!i).forEach((i) => (i.selected = true));
    this.cdr.detectChanges();
  }

  resetItems() {
    this.gridDrags().forEach((x) => {
      x.reset();
      x.getRootElement().style.gridArea = '';
    });
  }

  showGridContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.gridMenu().setPosition(event.x, event.y);
    this.gridMenu().toggle();
  }

  drop(event: CdkDragDrop<LdapEntryNode[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  onDrop(event: CdkDragEnd) {
    if (!this.alignItems) {
      return;
    }
    const pos = event.dropPoint;
    const dragRef = event.source;
    const cellWidth = 64 + 8;
    const cellHeight = 64 + 8;

    const offsetLeft = this.grid().nativeElement.offsetLeft;
    const offsetTop = this.grid().nativeElement.offsetTop;

    let gridXPos = Math.floor((pos.x - offsetLeft) / cellWidth) + 1;
    let gridYPos = Math.floor((pos.y - offsetTop) / cellHeight) + 1;
    dragRef.reset();
    const el = dragRef.getRootElement();
    let oddIteration = 0;
    while (this.isCellOccupied(gridXPos, gridYPos)) {
      if (oddIteration % 2 == 0) gridXPos += 1;
      else gridYPos += 1;
      oddIteration++;
    }
    el.style.gridArea = `${gridYPos} / ${gridXPos}`;
  }

  isCellOccupied(xPos: number, yPos: number) {
    return this.gridDrags().some((x) => {
      const el = x.getRootElement();
      if (!el.style.gridArea) {
        return false;
      }
      const pos = el.style.gridArea.split('/');
      return Number(pos[0]) == yPos && Number(pos[1]) == xPos;
    });
  }

  clickOutside() {
    this.items.forEach((x) => (x.selected = false));
  }

  onGetFocus() {
    const selected = this.getSelected();
    if (selected.length == 0) {
      this.setSelected([this.items[0]]);
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    if (
      event.key == 'ArrowDown' ||
      event.key == 'ArrowRight' ||
      event.key == 'ArrowLeft' ||
      event.key == 'ArrowUp'
    ) {
      const selectedItems = this.getSelected();
      if (selectedItems.length == 0) {
        this.setSelected([this.items[0]]);
        return;
      }
      let currentIndex = this.items.findIndex((x) => x.id == selectedItems[0].id);
      if (event.key == 'ArrowDown' || event.key == 'ArrowRight') {
        currentIndex = (currentIndex + 1) % this.items.length;
      }

      if (event.key == 'ArrowLeft' || event.key == 'ArrowUp') {
        currentIndex = currentIndex - 1 < 0 ? this.items.length - 1 : currentIndex - 1;
      }
      this.setSelected([this.items[currentIndex]]);
    }

    if (event.key == 'Enter') {
      const selectedItems = this.getSelected();
      if (selectedItems.length == 0) {
        this.setSelected([this.items[0]]);
        return;
      }
    }
  }
}
