import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { SearchResultComponent } from './search-forms/search-result/search-result.component';
import { SearchUsersComponent } from './search-forms/search-users/search-users.component';
import { SearchPanelComponent } from './search-panel.component';
import { SearchSourceProvider } from './services/search-source-provider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    SearchPanelComponent,
    SearchUsersComponent,
    SearchResultComponent,
  ],
  exports: [SearchPanelComponent],
  providers: [SearchSourceProvider],
})
export class SearchPanelModule {}
