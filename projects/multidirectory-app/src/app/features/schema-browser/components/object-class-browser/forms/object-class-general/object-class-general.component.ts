import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-object-class-general',
  imports: [MultidirectoryUiKitModule, ReactiveFormsModule, CommonModule],
  templateUrl: './object-class-general.component.html',
  styleUrl: './object-class-general.component.scss',
})
export class ObjectClassCreateGeneralComponent {
  objectClassInput = input<SchemaObjectClass>();
  objectClass = computed(() => this.objectClassInput() ?? new SchemaObjectClass({}));
  form = new FormGroup({
    oid: new FormControl(this.objectClass().oid),
    name: new FormControl(this.objectClass().name),
    single_value: new FormControl(this.objectClass().single_value),
    no_user_modification: new FormControl(this.objectClass().no_user_modification),
    syntax: new FormControl(this.objectClass().syntax),
  });
}
