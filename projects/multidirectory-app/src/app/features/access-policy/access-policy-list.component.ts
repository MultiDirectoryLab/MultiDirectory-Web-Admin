import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccessPolicy } from '@core/access-policy/access-policy';
import {
  AccessPolicyViewModalComponent
} from '@features/access-policy/access-policy-view-modal/access-policy-view-modal.component';
import { AccessPolicyComponent } from '@features/access-policy/access-policy/access-policy.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ButtonComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-access-policy-list',
  templateUrl: './access-policy-list.component.html',
  styleUrls: ['./access-policy-list.component.scss'],
  imports: [
    ButtonComponent,
    TranslocoPipe,
    CdkDropList,
    CdkDrag,
    AccessPolicyComponent,
    ModalInjectDirective,
    AccessPolicyViewModalComponent
  ],
})
export class AccessPolicySettingsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private api = inject(MultidirectoryApiService);
  private windows = inject(AppWindowsService);
  private router = inject(Router);

  readonly accessClientCreateModal = viewChild.required<ModalInjectDirective>('createModal');

  properties: any[] = [];
  propColumns = [
    { name: '№', prop: 'no', flexGrow: 1 },
    { name: 'Домен', prop: 'name', flexGrow: 2 },
    { name: 'Диапазон адресов', prop: 'addressRanges', flexGrow: 2 },
    { name: 'Включить', prop: 'enabled', flexGrow: 2 },
  ];

  clients: AccessPolicy[] = [];

  ngOnInit(): void {
    this.windows.showSpinner();
    this.api.getAccessPolicy().subscribe((x) => {
      this.clients = x;
      this.windows.hideSpinner();
    });
  }

  onDeleteClick(client: AccessPolicy) {
    if (!client?.id) {
      return;
    }
    if (this.clients.length <= 1) {
      this.toastr.error(translate('access-policy-settings.must-be-enabled'));
      return;
    }
    this.clients = this.clients.filter((x) => x != client);
    if (!this.clients.some((x) => x.enabled)) {
      this.toastr.error(translate('access-policy-settings.must-be-enabled'));
      this.clients[0].enabled = true;
      return;
    }
    this.api
      .deleteAccessPolicy(client.id)
      .pipe(switchMap(() => this.api.getAccessPolicy()))
      .subscribe((clients) => {
        this.clients = clients;
      });
  }

  onTurnOffClick(client: AccessPolicy) {
    if (!client.id) {
      return;
    }
    if (!this.clients.some((x) => x.enabled)) {
      this.toastr.error(translate('access-policy-settings.must-be-enabled'));
      const toRevert = this.clients.find((x) => x.id == client.id);
      if (toRevert) {
        setTimeout(() => (toRevert.enabled = true));
      }
      this.cdr.detectChanges();
      return;
    }
    this.api
      .switchAccessPolicy(client.id)
      .pipe(switchMap((x) => this.api.getAccessPolicy()))
      .subscribe((x) => {
        this.clients = x;
      });
  }

  onEditClick(toEdit: AccessPolicy) {
    if (!toEdit.id) {
      return;
    }
    this.router.navigate(['access-policy', toEdit.id]);
  }

  onAddClick() {
    this.accessClientCreateModal()
      ?.open({ minHeight: 435 }, { accessPolicy: new AccessPolicy() })
      .pipe(
        take(1),
        switchMap((client) => {
          if (!client) {
            return EMPTY;
          }
          delete client.id;
          client.priority = (this.clients.length + 1) * 10;
          this.clients.push(new AccessPolicy(client));
          return this.api.saveAccessPolicy(client);
        }),
        catchError((err) => {
          this.clients.pop();
          this.toastr.error(translate('access-policy-settings.unable-to-create-policy'));
          return EMPTY;
        }),
        switchMap(() => this.api.getAccessPolicy()),
      )
      .subscribe((clients) => {
        this.clients = clients;
      });
  }

  onDrop(event: CdkDragDrop<string[]>) {
    const previous = this.clients[event.previousIndex];
    const current = this.clients[event.currentIndex];
    [this.clients[event.previousIndex], this.clients[event.currentIndex]] = [
      this.clients[event.currentIndex],
      this.clients[event.previousIndex],
    ];
    if (!previous.id || !current.id) {
      this.toastr.error(translate('access-policy-settings.policy-id-not-found'));
      return;
    }
    if (previous.id == current.id) {
      return;
    }
    this.api
      .swapAccessPolicies(previous.id, current.id)
      .pipe(switchMap(() => this.api.getAccessPolicy()))
      .subscribe((result) => {
        this.clients = result;
      });
  }
}
