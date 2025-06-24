import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaService } from '@services/schema/schema.service';

@Component({
  selector: 'app-entities-browser',
  imports: [CommonModule],
  templateUrl: './entities-browser.component.html',
  styleUrl: './entities-browser.component.scss',
})
export class EntitiesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);

  entites = signal<SchemaEntity[]>([]);

  ngOnInit(): void {
    this.schema.getEntities().subscribe((result) => {
      this.entites.set(result);
    });
  }
}
