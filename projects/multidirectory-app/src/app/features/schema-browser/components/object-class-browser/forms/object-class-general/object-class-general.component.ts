import { CommonModule } from '@angular/common';
import { Component, computed, Input, input } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-object-class-general',
  imports: [MultidirectoryUiKitModule, FormsModule, CommonModule],
  templateUrl: './object-class-general.component.html',
  styleUrl: './object-class-general.component.scss',
})
export class ObjectClassCreateGeneralComponent {
  @Input() objectClass = new SchemaObjectClass({});
  kindOptions = ['AUXILARY', 'STRUCTURAL', 'ABSTRACT'];
}
