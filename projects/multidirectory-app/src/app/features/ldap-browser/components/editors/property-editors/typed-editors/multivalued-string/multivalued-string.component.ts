import { ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, TextboxComponent, TreeviewComponent } from 'multidirectory-ui-kit';
import { AttributeListEntry } from '../../../attributes-list/attributes-list.component';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';

@Component({
  selector: 'app-multivalued-string-editor',
  templateUrl: './multivalued-string.component.html',
  styleUrls: ['./multivalued-string.component.scss'],
  imports: [TranslocoPipe, TextboxComponent, FormsModule, ButtonComponent, TreeviewComponent],
})
export class MultivaluedStringComponent extends TypedEditorBaseComponent {
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('treeview', { static: true }) treeview!: TreeviewComponent;
  newAttribute: string = '';
  type: string = '';

  @Input() override set propertyValue(val: string[]) {
    this._propertyValue = this.treeview?.tree.map((x) => x?.name ?? '') ?? '';
    this.treeview!.tree = [];
    if (!Array.isArray(val)) {
      val = [val];
    }
    const tree = val
      .filter((x) => !!x)
      .map(
        (x) =>
          new AttributeListEntry({
            name: x,
            id: x,
            type: this.type,
            selectable: true,
            expandable: false,
          }),
      );
    setTimeout(() => {
      this.treeview.tree = tree;
      this.treeview.redraw();
    });
  }

  addAttribute() {
    this.treeview?.addRoot(
      new AttributeListEntry({
        name: this.newAttribute,
        id: this.newAttribute,
        selectable: true,
        type: this.type,
        new: true,
      }),
    );
    this._propertyValue = this.treeview?.tree.map((x) => x?.name ?? '') ?? '';
    this.propertyValueChange.emit(this._propertyValue);
    this.newAttribute = '';
  }

  deleteAttribute() {
    this.treeview!.tree = this.treeview?.tree.filter((x) => !x.selected) ?? [];
    this._propertyValue = this.treeview?.tree.map((x) => x?.name ?? '') ?? '';
    this.propertyValueChange.emit(this._propertyValue);
    this.treeview!.redraw();
  }
}
