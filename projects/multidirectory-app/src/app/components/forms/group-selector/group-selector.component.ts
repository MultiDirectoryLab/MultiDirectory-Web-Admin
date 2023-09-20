import { Component, ViewChild } from "@angular/core";
import { MdModalComponent } from "multidirectory-ui-kit";
import { EntityTypeSelectorComponent } from "../entity-type-selector/entity-type-selector.component";

@Component({
    selector: 'app-group-selector',
    templateUrl: './group-selector.component.html',
    styleUrls: ['./group-selector.component.scss']
}) 
export class GroupSelectorComponent {
    @ViewChild('modal', { static: true }) modal?: MdModalComponent;
    @ViewChild('entityTypeSelector', { static: true }) entityTypeSelector?: EntityTypeSelectorComponent;
    constructor() {}

    open() {
        this.modal?.open();
    }
    close() {
        this.modal?.close();
    }

    selectEntityType() {
        this.entityTypeSelector?.open();
    }
}