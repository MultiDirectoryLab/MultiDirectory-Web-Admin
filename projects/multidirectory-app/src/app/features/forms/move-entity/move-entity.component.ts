import { Component, OnInit } from '@angular/core';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { AppWindowsService } from '@services/app-windows.service';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { take } from 'rxjs';

@Component({
  selector: 'app-move-entity',
  templateUrl: './move-entity.component.html',
  styleUrls: ['./move-entity.component.scss'],
})
export class MoveEntityDialogComponent implements OnInit {
  toMove: LdapEntryNode[] = [];
  targetDn = '';

  constructor(
    private modalControl: ModalInjectDirective,
    private windows: AppWindowsService,
  ) {}

  ngOnInit(): void {
    this.toMove = this.modalControl.contentOptions.toMove;
  }

  onClick() {
    this.windows
      .openEntitySelector([])
      .pipe(take(1))
      .subscribe((x) => {
        alert(x);
      });
  }
}
