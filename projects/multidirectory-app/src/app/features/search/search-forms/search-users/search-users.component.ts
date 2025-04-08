import { Component, EventEmitter, Output } from '@angular/core';
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
  searchQuery: string = '';
  @Output() onClear = new EventEmitter<void>();

  clear() {
    this.searchQuery = '';
    this.onClear.emit();
  }
}
