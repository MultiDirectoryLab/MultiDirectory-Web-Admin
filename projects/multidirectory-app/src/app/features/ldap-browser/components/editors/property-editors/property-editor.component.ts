import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntityAttributeType } from '@core/entity-attributes/entity-attribute-type';
import { IntegerPropertyEditorComponent } from '@features/ldap-browser/components/editors/property-editors/typed-editors/integer/integer-property-editor.component';
import { MultivaluedStringComponent } from '@features/ldap-browser/components/editors/property-editors/typed-editors/multivalued-string/multivalued-string.component';
import { StringPropertyEditorComponent } from '@features/ldap-browser/components/editors/property-editors/typed-editors/string/string-property-editor.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { EditPropertyRequest } from '@models/entity-attribute/edit-property-request';
import {
  ButtonComponent,
  DropdownComponent,
  DropdownOption,
  ModalInjectDirective,
} from 'multidirectory-ui-kit';

@Component({
  selector: 'app-property-editor',
  styleUrls: ['./property-editor.component.scss'],
  templateUrl: './property-editor.component.html',
  imports: [
    TranslocoPipe,
    DropdownComponent,
    FormsModule,
    StringPropertyEditorComponent,
    IntegerPropertyEditorComponent,
    MultivaluedStringComponent,
    ButtonComponent,
  ],
})
export class PropertyEditorComponent implements OnInit {
  private modalControl = inject<ModalInjectDirective>(ModalInjectDirective);

  LdapPropertyType = EntityAttributeType;
  editRequest!: EditPropertyRequest;

  propertyTypes = Object.values(EntityAttributeType)
    .filter((x) => Number.isNaN(Number(x)))
    .map(
      (x) =>
        new DropdownOption({
          title: String(x),
          value: x,
        }),
    );

  ngOnInit(): void {
    this.editRequest = this.modalControl.contentOptions as EditPropertyRequest;
  }

  close() {
    this.modalControl.close(null);
  }

  finish() {
    this.modalControl.close(this.editRequest);
  }
}
