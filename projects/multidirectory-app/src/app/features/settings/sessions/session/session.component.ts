import { Component, inject, input, output } from '@angular/core';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { PlaneButtonComponent } from 'multidirectory-ui-kit';
import { PlateListItemComponent } from '../../../../components/app-layout/shared/plate-list-item/plate-list-item.component';
import { UserSession } from '@models/api/sessions/user-session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [PlateListItemComponent, PlaneButtonComponent],
})
export class SessionComponent {
  private api = inject(MultidirectoryApiService);
  readonly session = input(new UserSession({}));
  readonly index = input(0);
  readonly deleteClick = output<UserSession>();

  onDeleteClick() {
    this.deleteClick.emit(this.session());
  }
}
