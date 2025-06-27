import { Component } from '@angular/core';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ObjectClassCreateGeneralComponent } from '../forms/object-class-general/object-class-general.component';
import { ObjectClassAttributeSummaryComponent } from '../forms/object-class-attribute-summary/object-class-attribute-summary.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-object-class-create-dialog',
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    ObjectClassCreateGeneralComponent,
    ObjectClassAttributeSummaryComponent,
    TranslocoModule,
  ],
  templateUrl: './object-class-create-dialog.component.html',
  styleUrl: './object-class-create-dialog.component.scss',
})
export class ObjectClassCreateDialogComponent {}
