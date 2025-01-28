import { Component, OnInit } from '@angular/core';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  constructor(private api: MultidirectoryApiService) {}
  ngOnInit(): void {
    this.api.getSessions();
  }
}
