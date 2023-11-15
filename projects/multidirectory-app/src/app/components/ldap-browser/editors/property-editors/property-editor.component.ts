import { Component, Inject, OnInit } from "@angular/core";
import { DropdownOption, ModalInjectDirective } from "multidirectory-ui-kit";
import { LdapPropertyType } from "projects/multidirectory-app/src/app/core/ldap/property-type-resolver";

@Component({
    selector: 'app-property-editor',
    styleUrls: ['./property-editor.component.scss'],
    templateUrl: './property-editor.component.html'
})
export class PropertyEditorComponent implements OnInit {
    LdapPropertyType = LdapPropertyType;
    propertyType?: LdapPropertyType;
    propertyName = '';
    propertyValue: string[] = [];
    propertyTypes =  Object.values(LdapPropertyType).filter(x => Number.isNaN(Number(x))).map(x => new DropdownOption({
        title: String(x),
        value: x
    }));
    constructor(@Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {
    }
    ngOnInit(): void {
        this.propertyType = this.modalControl.contentOptions?.['propertyType'];
        this.propertyName = this.modalControl.contentOptions?.['propertyName'];
        this.propertyValue = this.modalControl.contentOptions?.['propertyValue'];
    }

    close() {
        this.modalControl.close(null);
    }

    finish() {
        console.log(this.propertyValue);
        this.modalControl.close(this.propertyValue);
    }
}