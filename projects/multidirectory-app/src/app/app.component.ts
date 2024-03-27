import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppWindowsService } from './services/app-windows.service';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerComponent } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  title = 'multidirectory-app';
  @ViewChild('spinner', {static: true}) spinner!: SpinnerComponent;

  constructor(private windows: AppWindowsService) {
  }

  ngAfterViewInit(): void {
    this.windows.globalSpinnerRx.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(show => {
      if(show) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
