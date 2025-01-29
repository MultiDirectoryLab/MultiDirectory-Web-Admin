import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserSession } from '@models/sessions/user-session';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
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
