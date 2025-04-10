import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { TranslocoPipe } from '@jsverse/transloco';
import { ModifyDnRequest } from '@models/modify-dn/modify-dn';
import { AppWindowsService } from '@services/app-windows.service';
import { ButtonComponent, ModalInjectDirective, TextboxComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';
import { EntitySelectorSettings } from '../entity-selector/entity-selector-settings.component';

@Component({
  selector: 'app-move-entity',
  templateUrl: './move-entity.component.html',
  styleUrls: ['./move-entity.component.scss'],
  imports: [TranslocoPipe, TextboxComponent, ButtonComponent, FormsModule],
})
export class MoveEntityDialogComponent implements OnInit {
  private modalControl = inject(ModalInjectDirective);
  private windows = inject(AppWindowsService);

  toMove: LdapEntryNode[] = [];
  targetDn = '';

  ngOnInit(): void {
    this.toMove = this.modalControl.contentOptions.toMove;
  }

  onClick() {
    this.windows
      .openEntitySelector(
        new EntitySelectorSettings({
          selectedEntities: [],
          selectedEntityTypes: ENTITY_TYPES.filter((x) => x.id == 'catalogs') ?? [],
          allowSelectEntityTypes: false,
          entityToMove: this.toMove,
        }),
      )
      .pipe(take(1))
      .subscribe((x) => {
        if (x && x.length > 0) {
          this.targetDn = x[0].id;
        }
      });
  }

  move() {
    const request = new ModifyDnRequest();
    const fromDn = this.toMove[0].id;
    request.new_superior = this.targetDn;
    request.entry = fromDn;
    request.newrdn = LdapNamesHelper.getDnName(fromDn);
    request.deleteoldrdn = true;
    this.modalControl.close(request);
  }

  cancel() {
    this.modalControl.close();
  }
}
