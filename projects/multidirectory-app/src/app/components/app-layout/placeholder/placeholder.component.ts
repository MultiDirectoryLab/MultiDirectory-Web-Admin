import { Component } from '@angular/core';
import { AppWindowsService } from '@services/app-windows.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-placeholder',
  styleUrls: ['./placeholder.component.scss'],
  templateUrl: './placeholder.component.html',
})
export class PlaceholderComponent {
  constructor(private windows: AppWindowsService) {}
  showEntitySelector() {
    this.windows
      .openEntitySelector([])
      .pipe(take(1))
      .subscribe((result) => {
        alert(result);
      });
  }
}
