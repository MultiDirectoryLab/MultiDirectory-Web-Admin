import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MultidirectoryUiKitModule, TreeviewComponent } from 'multidirectory-ui-kit';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { AttributeListEntry } from '../../../../../../components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';

@Component({
  selector: 'app-multivalued-string-editor',
  templateUrl: './multivalued-string.component.html',
  styleUrls: ['./multivalued-string.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule, FormsModule, TranslocoPipe],
})
export class MultivaluedStringComponent extends TypedEditorBaseComponent {
  @ViewChild('treeview', { static: true }) treeview!: TreeviewComponent;
  newAttribute: string = '';
  type: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

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
    this.propertyValueChange.next(this._propertyValue);
    this.newAttribute = '';
  }

  deleteAttribute() {
    this.treeview!.tree = this.treeview?.tree.filter((x) => !x.selected) ?? [];
    this._propertyValue = this.treeview?.tree.map((x) => x?.name ?? '') ?? '';
    this.propertyValueChange.next(this._propertyValue);
    this.treeview!.redraw();
  }
}
