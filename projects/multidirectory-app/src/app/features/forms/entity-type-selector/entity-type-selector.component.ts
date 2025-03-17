import { Component, OnInit } from '@angular/core';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { EntityType } from '@core/entities/entities-type';
import { ModalInjectDirective, Treenode } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-entity-type-selector',
  styleUrls: ['./entity-type-selector.component.scss'],
  templateUrl: './entity-type-selector.component.html',
})
export class EntityTypeSelectorComponent implements OnInit {
  tree = ENTITY_TYPES.map((x) => new Treenode({ id: x.id, name: x.name }));

  constructor(private modalControl: ModalInjectDirective) {}

  ngOnInit(): void {
    const selected = this.modalControl.contentOptions.selectedEntityTypes as EntityType[];
    this.tree.forEach((x) => {
      x.selected = selected.findIndex((select) => select.id == x.id) > -1;
    });
  }

  close() {
    this.modalControl?.close();
  }

  finish() {
    const selectedItems = this.tree.filter((x) => x.selected).map((x) => x.id);
    const result = ENTITY_TYPES.filter((x) => selectedItems.includes(x.id));
    this.modalControl?.close(result);
  }
}
