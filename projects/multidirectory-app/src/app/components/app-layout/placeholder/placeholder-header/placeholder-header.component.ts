import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'placeholder-header',
  templateUrl: './placeholder-header.component.html',
  styleUrls: ['./placeholder-header.component.scss'],
  standalone: true,
  imports: [TranslocoPipe],
})
export class PlaceholderHeaderComponent {}
