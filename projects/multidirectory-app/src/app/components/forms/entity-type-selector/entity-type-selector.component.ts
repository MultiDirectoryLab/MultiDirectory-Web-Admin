import { Component, ViewChild } from "@angular/core";
import { MdModalComponent, Treenode } from "multidirectory-ui-kit";
import { ENTITY_TYPES } from "../../../core/entities/entities-available-types";

@Component({
    selector: 'app-entity-type-selector',
    styleUrls: ['./entity-type-selector.component.scss'],
    templateUrl: './entity-type-selector.component.html'
})
export class EntityTypeSelectorComponent {
    @ViewChild('modal') modal?: MdModalComponent;
    tree = ENTITY_TYPES.map(x => new Treenode({ id: x.id, name: x.name }));
    open() {
        this.modal?.open();
    }

    close() {}
}
