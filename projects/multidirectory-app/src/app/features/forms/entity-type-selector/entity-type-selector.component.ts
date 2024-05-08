import { Component, ViewChild } from '@angular/core';
import { MdModalComponent, ModalInjectDirective, Treenode } from 'multidirectory-ui-kit';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Observable, Subject } from 'rxjs';
import { EntityType } from '@core/entities/entities-type';

@Component({
  selector: 'app-entity-type-selector',
  styleUrls: ['./entity-type-selector.component.scss'],
  templateUrl: './entity-type-selector.component.html',
})
export class EntityTypeSelectorComponent {
  tree = ENTITY_TYPES.map((x) => new Treenode({ id: x.id, name: x.name, loadChildren: undefined }));

  constructor(private modalControl: ModalInjectDirective) {}

  close() {
    this.modalControl?.close();
  }

  finish() {
    const selectedItems = this.tree.filter((x) => x.selected).map((x) => x.id);
    const result = ENTITY_TYPES.filter((x) => selectedItems.includes(x.id));
    this.modalControl?.close(result);
  }
}
