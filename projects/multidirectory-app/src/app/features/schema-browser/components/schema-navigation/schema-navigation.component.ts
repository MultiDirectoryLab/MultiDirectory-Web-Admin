import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';

@Component({
  selector: 'app-schema-navigation',
  templateUrl: './schema-navigation.component.html',
  styleUrls: ['./schema-navigation.component.scss'],
  imports: [RouterModule, TranslocoModule, CommonModule],
})
export class SchemaNavigationComponent implements OnInit {
  private navigation = inject(AppNavigationService);
  private destroyRef$: DestroyRef = inject(DestroyRef);

  url = signal<string>('');

  ngOnInit(): void {
    this.navigation.navigationEnd.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.url.set(this.navigation.url);
    });
  }
}
