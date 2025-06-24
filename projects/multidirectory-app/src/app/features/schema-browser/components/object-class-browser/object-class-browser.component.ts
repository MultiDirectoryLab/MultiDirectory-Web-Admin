import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { SchemaService } from '@services/schema/schema.service';

@Component({
  selector: 'app-object-class-browser',
  imports: [CommonModule],
  templateUrl: './object-class-browser.component.html',
  styleUrl: './object-class-browser.component.scss',
})
export class ObjectClassBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  objectClasses = signal<SchemaObjectClass[]>([]);

  ngOnInit(): void {
    this.schema.getObjectClasses().subscribe((result) => {
      this.objectClasses.set(result);
    });
  }
}
