import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, NgZone, OnInit, Signal, viewChild } from '@angular/core';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-password-suggest-context-menu',
  imports: [PasswordConditionsComponent],
  templateUrl: './password-suggest-context-menu.component.html',
  styleUrl: './password-suggest-context-menu.component.scss',
})
export class PasswordSuggestContextMenuComponent implements OnInit {
  private dropdown = viewChild.required<ElementRef<HTMLDivElement>>('dropdown');
  private ngZone = inject(NgZone);
  dialogData = inject<{ password: Signal<string>; policy: PasswordPolicy }>(DIALOG_DATA);

  ngOnInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.handleOverflow();
    });
  }

  private handleOverflow(): void {
    const dropdownEl = this.dropdown().nativeElement;
    const dropdownRect: DOMRect = dropdownEl.getBoundingClientRect();

    const offsetX = window.innerWidth - (dropdownRect.x + dropdownRect.width);
    const offsetY = window.innerHeight - (dropdownRect.y + dropdownRect.height);

    dropdownEl.style.transform = `translate(${offsetX < 0 ? offsetX : 0}px, ${offsetY < 0 ? offsetY : 0}px)`;
  }
}
