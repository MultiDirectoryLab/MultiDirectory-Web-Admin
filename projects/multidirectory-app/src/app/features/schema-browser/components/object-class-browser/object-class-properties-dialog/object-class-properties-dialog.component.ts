import { Component } from '@angular/core';
import { DialogComponent } from '../../../../../components/modals/components/core/dialog/dialog.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';
import { ObjectClassCreateGeneralComponent } from '../forms/object-class-general/object-class-general.component';
import { ObjectClassAttributeSummaryComponent } from '../forms/object-class-attribute-summary/object-class-attribute-summary.component';
import { ObjectClassEntriesComponent } from '../forms/object-class-entries/object-class-entries.component';

@Component({
  selector: 'app-object-class-properties',
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    TranslocoModule,
    ObjectClassCreateGeneralComponent,
    ObjectClassAttributeSummaryComponent,
    ObjectClassEntriesComponent,
  ],
  templateUrl: './object-class-properties-dialog.component.html',
  styleUrl: './object-class-properties-dialog.component.scss',
})
export class ObjectClassPropertiesDialogComponent {}
