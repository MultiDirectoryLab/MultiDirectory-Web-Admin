import { Component, Input } from '@angular/core';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';
import { FormsModule } from '@angular/forms';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-user-create-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [FormsModule, MultidirectoryUiKitModule, TranslocoPipe],
})
export class UserCreateSummaryComponent {
  @Input() setupRequest!: UserCreateRequest;

  constructor(public setup: UserCreateService) {}
}
