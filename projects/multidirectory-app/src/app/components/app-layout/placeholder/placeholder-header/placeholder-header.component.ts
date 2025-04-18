import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-placeholder-header',
  templateUrl: './placeholder-header.component.html',
  styleUrls: ['./placeholder-header.component.scss'],
  imports: [TranslocoPipe],
})
export class PlaceholderHeaderComponent {}
