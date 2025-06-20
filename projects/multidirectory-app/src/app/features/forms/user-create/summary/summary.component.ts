import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserCreateRequest } from '@models/api/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';
import { TextboxComponent } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-user-create-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  imports: [TranslocoPipe, TextboxComponent, FormsModule],
})
export class UserCreateSummaryComponent {
  setup = inject(UserCreateService);

  @Input() setupRequest!: UserCreateRequest;
}
