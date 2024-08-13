import { NgModule } from '@angular/core';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { WindowsComponent } from './windows/windows.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { PropertiesModule } from '@features/ldap-entry-properties/properties.module';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import { EntityTypeSelectorModule } from '@features/forms/entity-type-selector/entity-type-selector.module';
import { CatalogSelectorModule } from '@features/forms/catalog-selector/catalog-selector.module';
import { AppFormsModule } from '@features/forms/forms.module';
import { DownloadComponent } from './download-dict.component';

@NgModule({
  declarations: [ContextMenuComponent, DeleteConfirmationModalComponent, WindowsComponent],
  exports: [ContextMenuComponent, DeleteConfirmationModalComponent, WindowsComponent],
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    TranslocoModule,
    EditorsModule,
    AppFormsModule,
    EntityTypeSelectorModule,
    PropertiesModule,
    CatalogSelectorModule,
  ],
})
export class SharedComponentsModule {}
