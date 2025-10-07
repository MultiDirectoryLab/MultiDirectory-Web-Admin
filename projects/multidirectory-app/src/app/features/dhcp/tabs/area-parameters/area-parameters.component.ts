import { Component } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'area-parameters',
  templateUrl: './area-parameters.component.html',
  styleUrls: ['./area-parameters.component.scss'],
  imports: [DatagridComponent, ButtonComponent, TranslocoPipe],
})
export default class DhcpAreaParametersComponent {
  rows = [
    { parameterName: '192.168.51.10', supplier: 'PC-001', meaning: '', nameOfThePolicy: '' },
    { parameterName: '192.168.51.50', supplier: 'PC-005', meaning: '', nameOfThePolicy: '' },
  ];
  columns = [
    { name: translate('tabAreaParameters.parameterName'), prop: 'parameterName', flexGrow: 1 },
    { name: translate('tabAreaParameters.supplier'), prop: 'name', flexGrow: 1 },
    { name: translate('tabAreaParameters.meaning'), prop: 'meaning', flexGrow: 1 },
    { name: translate('tabAreaParameters.nameOfThePolicy'), prop: 'nameOfThePolicy', flexGrow: 1 },
  ];
  private dialogService: any;

  edit() {}
}
