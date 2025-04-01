import { Component, EventEmitter, Output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-users',
  styleUrls: ['./search-users.component.scss'],
  templateUrl: './search-users.component.html',
  standalone: true,
  imports: [TranslocoDirective, MultidirectoryUiKitModule, FormsModule],
})
export class SearchUsersComponent {
  searchQuery: string = '';
  @Output() onClear = new EventEmitter<void>();

  clear() {
    this.searchQuery = '';
    this.onClear.emit();
  }
}
