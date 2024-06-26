import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Validator } from '@angular/forms';
import {
  MdModalComponent,
  ModalInjectDirective,
  Treenode,
  TreeviewComponent,
} from 'multidirectory-ui-kit';
import { Observable, Subject } from 'rxjs';

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
})
export class AttributeListComponent implements OnInit {
  @ViewChild('treeview', { static: true }) treeview: TreeviewComponent | null = null;
  title = '';
  newAttribute: string = '';
  type: string = '';
  values: string[] = [];
  tree: AttributeListEntry[] = [];
  toDelete: AttributeListEntry[] = [];

  constructor(
    private modalControl: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
  ) {}

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
    const result = this.treeview?.tree.map((x) => x.name ?? '') ?? [];
    this.modalControl.close(result);
  }

  close() {
    this.modalControl.close(null);
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
  }

  deleteAttribute() {
    this.toDelete = this.toDelete.concat(
      <AttributeListEntry[]>this.tree.filter((x) => x.selected && !(<AttributeListEntry>x).new) ??
        [],
    );
    this.tree = this.tree.filter((x) => !x.selected) ?? [];
  }
}
