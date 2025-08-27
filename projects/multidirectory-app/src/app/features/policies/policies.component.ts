import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss'],
  imports: [RouterOutlet],
})
export class PoliciesComponent implements OnDestroy {
  user: WhoamiResponse | null = null;
  unsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
