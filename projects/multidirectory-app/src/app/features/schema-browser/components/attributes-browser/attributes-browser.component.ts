import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaService } from '@services/schema/schema.service';

@Component({
  selector: 'app-attributes-browser',
  imports: [CommonModule],
  templateUrl: './attributes-browser.component.html',
  styleUrl: './attributes-browser.component.scss',
})
export class AttributesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  attributeTypes = signal<SchemaAttributeType[]>([]);
  ngOnInit(): void {
    this.schema.getAttributes().subscribe((result) => {
      this.attributeTypes.set(result);
    });
  }
}
