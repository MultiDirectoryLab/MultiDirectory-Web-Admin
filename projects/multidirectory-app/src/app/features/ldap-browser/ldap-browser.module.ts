import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { HotkeyModule } from 'angular2-hotkeys';
import { CatalogContentComponent } from './components/catalog-content/catalog-content.component';
import { GridItemComponent } from './components/catalog-content/views/icon-view/grid-item/grid-item.component';
import { IconViewComponent } from './components/catalog-content/views/icon-view/icon-view.component';
import { TableViewComponent } from './components/catalog-content/views/table-view/table-view.component';
import { LdapBrowserHeaderComponent } from './components/ldap-browser-header/ldap-browser-header.component';

@NgModule({
  imports: [
    CommonModule,
    ValidatorsModule,
    FormsModule,
    TranslocoModule,
    DragDropModule,
    HotkeyModule,
    FontAwesomeModule,
    CatalogContentComponent,
    TableViewComponent,
    IconViewComponent,
    GridItemComponent,
    LdapBrowserHeaderComponent,
  ],
  exports: [],
})
export class LdapBrowserModule {}
