import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { CommonModule } from '@angular/common';
import { LdapBrowserRoutingModule } from './ldap-browser-routing.module';
import { HotkeyModule } from 'angular2-hotkeys';
import { ValidatorsModule } from '@core/validators/validators.module';
import { CatalogContentComponent } from './components/catalog-content/catalog-content.component';
import { GridItemComponent } from './components/catalog-content/views/icon-view/grid-item/grid-item.component';
import { IconViewComponent } from './components/catalog-content/views/icon-view/icon-view.component';
import { TableViewComponent } from './components/catalog-content/views/table-view/table-view.component';
import { LdapBrowserHeaderComponent } from './components/ldap-browser-header/ldap-browser-header.component';
import { AppFormsModule } from '@features/forms/forms.module';

@NgModule({
  declarations: [
    CatalogContentComponent,
    TableViewComponent,
    IconViewComponent,
    GridItemComponent,
    LdapBrowserHeaderComponent,
  ],
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    ValidatorsModule,
    FormsModule,
    TranslocoModule,
    DragDropModule,
    HotkeyModule,
    LdapBrowserRoutingModule,
    AppFormsModule,
  ],
  exports: [],
})
export class LdapBrowserModule {}
