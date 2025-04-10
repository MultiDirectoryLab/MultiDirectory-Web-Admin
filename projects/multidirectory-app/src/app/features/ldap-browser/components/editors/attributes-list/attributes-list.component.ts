import { ChangeDetectorRef, Component, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  ModalInjectDirective,
  TextboxComponent,
  Treenode,
  TreeviewComponent,
} from 'multidirectory-ui-kit';

export class AttributeListEntry extends Treenode {
  type = '';
  new = false;

  constructor(obj: Partial<AttributeListEntry>) {
    super(obj);
    Object.assign(this, obj);
  }
}

@Component({
  selector: 'app-attribute-list',
  styleUrls: ['./attributes-list.component.scss'],
  templateUrl: './attributes-list.component.html',
  imports: [TranslocoPipe, TextboxComponent, FormsModule, ButtonComponent, TreeviewComponent],
})
export class AttributeListComponent implements OnInit {
  private modalControl = inject(ModalInjectDirective);
  private cdr = inject(ChangeDetectorRef);

  readonly treeview = viewChild.required(TreeviewComponent);
  title = '';
  newAttribute: string = '';
  type: string = '';
  values: string[] = [];
  tree: AttributeListEntry[] = [];
  toDelete: AttributeListEntry[] = [];

  ngOnInit(): void {
    this.title = this.modalControl.contentOptions.title;
    this.type = this.modalControl.contentOptions.type;
    this.values = this.modalControl.contentOptions.values ?? [];

    this.tree = this.values.map(
      (x) =>
        new AttributeListEntry({
          name: x,
          id: x,
          selectable: true,
          type: this.type,
          new: false,
        }),
    );
  }

  apply() {
    const result = this.treeview().tree.map((x) => x.name ?? '') ?? [];
    this.modalControl.close(result);
  }

  close() {
    this.modalControl.close(null);
  }

  addAttribute() {
    this.treeview().addRoot(
      new AttributeListEntry({
        name: this.newAttribute,
        id: this.newAttribute,
        selectable: true,
        type: this.type,
        new: true,
      }),
    );
  }

  deleteAttribute() {
    this.toDelete = this.toDelete.concat(
      <AttributeListEntry[]>this.tree.filter((x) => x.selected && !(<AttributeListEntry>x).new) ??
        [],
    );
    this.tree = this.tree.filter((x) => !x.selected) ?? [];
  }
}
