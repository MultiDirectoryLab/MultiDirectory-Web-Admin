import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonComponent, TextboxComponent } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-search-users',
  styleUrls: ['./search-users.component.scss'],
  templateUrl: './search-users.component.html',
  imports: [TranslocoDirective, TextboxComponent, FormsModule, ButtonComponent],
})
export class SearchUsersComponent {
  searchQuery = '';
  readonly clear = output<void>();

  clearSearch() {
    this.searchQuery = '';
    this.clear.emit();
  }
}
