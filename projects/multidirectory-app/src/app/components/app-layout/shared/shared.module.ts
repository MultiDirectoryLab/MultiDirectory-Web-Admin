import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CatalogSelectorModule } from '@features/forms/catalog-selector/catalog-selector.module';
import { EntityTypeSelectorModule } from '@features/forms/entity-type-selector/entity-type-selector.module';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PlateListItemComponent } from './plate-list-item/plate-list-item.component';
import { WindowsComponent } from './windows/windows.component';

@NgModule({
  exports: [
    ContextMenuComponent,
    DeleteConfirmationModalComponent,
    WindowsComponent,
    NotificationsComponent,
    PlateListItemComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    EditorsModule,
    EntityTypeSelectorModule,
    PropertiesModule,
    CatalogSelectorModule,
    FontAwesomeModule,
    ContextMenuComponent,
    DeleteConfirmationModalComponent,
    WindowsComponent,
    NotificationsComponent,
    PlateListItemComponent,
  ],
})
export class SharedComponentsModule {}
