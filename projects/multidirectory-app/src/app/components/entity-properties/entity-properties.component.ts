import { Component, ViewChild } from "@angular/core";
import { MdModalComponent } from "multidirectory-ui-kit";

@Component({
    selector: 'app-entity-properties',
    styleUrls: ['./entity-properties.component.scss'],
    templateUrl: './entity-properties.component.html'
})
export class EntityPropertiesComponent {
    @ViewChild('properties', { static: true }) propertiesModal?: MdModalComponent;

    open() {
        this.propertiesModal!.open();
    }
}