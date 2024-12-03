import { Component, Inject, OnInit } from '@angular/core';
import { EntityAttributeType } from '@core/entity-attributes/entity-attribute-type';
import { EditPropertyRequest } from '@models/entity-attribute/edit-property-request';
import { DropdownOption, ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-property-editor',
  styleUrls: ['./property-editor.component.scss'],
  templateUrl: './property-editor.component.html',
})
export class PropertyEditorComponent implements OnInit {
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

  constructor(@Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {}

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
