import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-schema-navigation',
  templateUrl: './schema-navigation.component.html',
  styleUrls: ['./schema-navigation.component.scss'],
  imports: [RouterModule, TranslocoModule],
})
export class SchemaNavigationComponent {}
