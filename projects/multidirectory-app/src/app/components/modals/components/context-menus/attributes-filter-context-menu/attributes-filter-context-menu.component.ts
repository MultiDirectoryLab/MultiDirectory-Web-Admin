import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  inject,
  model,
  NgZone,
  OnInit,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { AttributeFilter } from '@models/api/entity-attribute/attribute-filter';
import { CheckboxComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';

@Component({
  selector: 'app-attributes-filter-context-menu',
  imports: [TranslocoPipe, CheckboxComponent, FormsModule],
  templateUrl: './attributes-filter-context-menu.component.html',
  styleUrl: './attributes-filter-context-menu.component.scss',
})
export class AttributesFilterContextMenuComponent implements OnInit {
  private dropdown = viewChild.required<ElementRef<HTMLDivElement>>('dropdown');
  public dialogData = inject<{ filter: WritableSignal<AttributeFilter> }>(DIALOG_DATA);
  private ngZone = inject(NgZone);
  public showWithValuesOnly = model(this.dialogData.filter().showWithValuesOnly);
  public showWritableOnly = model(this.dialogData.filter().showWritableOnly);

  public ngOnInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.handleOverflow();
    });
  }

  public onFilterChange(): void {
    this.dialogData.filter.update((filter) => ({
      ...filter,
      showWritableOnly: this.showWritableOnly(),
      showWithValuesOnly: this.showWithValuesOnly(),
    }));
  }

  private handleOverflow(): void {
    const dropdownEl = this.dropdown().nativeElement;
    const dropdownRect: DOMRect = dropdownEl.getBoundingClientRect();

    const offsetX = window.innerWidth - (dropdownRect.x + dropdownRect.width);
    const offsetY = window.innerHeight - (dropdownRect.y + dropdownRect.height);

    dropdownEl.style.transform = `translate(${offsetX < 0 ? offsetX : 0}px, ${offsetY < 0 ? offsetY : 0}px)`;
  }
}
