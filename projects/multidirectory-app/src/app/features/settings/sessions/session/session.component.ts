import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSession } from '@models/sessions/user-session';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { PlateListItemComponent } from '../../../../components/app-layout/shared/plate-list-item/plate-list-item.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  standalone: true,
  imports: [PlateListItemComponent, MultidirectoryUiKitModule],
})
export class SessionComponent {
  @Input() session = new UserSession({});
  @Input() index = 0;
  @Output() deleteClick = new EventEmitter<UserSession>();

  constructor(private api: MultidirectoryApiService) {}

  onDeleteClick() {
    this.deleteClick.emit(this.session);
  }
}
