import { Component, ViewChild } from "@angular/core";
import { MdModalComponent, Treenode } from "multidirectory-ui-kit";
import { ENTITY_TYPES } from "@core/entities/entities-available-types";
import { Observable, Subject } from "rxjs";
import { EntityType } from "@core/entities/entities-type";

@Component({
    selector: 'app-entity-type-selector',
    styleUrls: ['./entity-type-selector.component.scss'],
    templateUrl: './entity-type-selector.component.html'
})
export class EntityTypeSelectorComponent {
    @ViewChild('modal') modal?: MdModalComponent;
    private _result = new Subject<EntityType[] | null>(); 
    tree = ENTITY_TYPES.map(x => new Treenode({ id: x.id, name: x.name }));

    open(): Observable<EntityType[] | null> {
        this.modal?.open();
        return this._result.asObservable();
    }

    close() {
        this.modal?.close();
        this._result.next(null);
    }

    finish() {
        this.modal?.close();
        this._result.next(ENTITY_TYPES.filter(x => this.tree.find(y => y.id == x.id)?.selected));
    }
}
