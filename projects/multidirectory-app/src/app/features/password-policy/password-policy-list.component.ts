import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordPolicyCreateComponent } from '@features/password-policy/password-policy-create/password-policy-create.component';
import { PasswordPolicyListItemComponent } from '@features/password-policy/password-policy-list-item/password-policy-list-item.component';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { switchMap } from 'rxjs';

@Component({
  selector: 'password-policy-list',
  templateUrl: './password-policy-list.component.html',
  styleUrls: ['./password-policy-list.component.scss'],
  imports: [PasswordPolicyListItemComponent, PasswordPolicyCreateComponent, ModalInjectDirective],
})
export class PasswordPolicyListComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  private router = inject(Router);
  private windows = inject(AppWindowsService);

  readonly appCratePolicyModal = viewChild(ModalInjectDirective);

  properties: any[] = [];

  clients: PasswordPolicy[] = [];

  ngOnInit(): void {
    this.windows.showSpinner();
    this.api.getPasswordPolicy().subscribe((x) => {
      this.clients = [x];
      this.windows.hideSpinner();
    });
  }

  onDeleteClick(client: PasswordPolicy) {
    if (!client?.id) {
      return;
    }
    this.clients = this.clients.filter((x) => x != client);
    this.api
      .deletePasswordPolicy()
      .pipe(switchMap(() => this.api.getPasswordPolicy()))
      .subscribe((clients) => {
        this.clients = [clients];
      });
  }

  onEditClick(toEdit: PasswordPolicy) {
    this.router.navigate(['password-policy', toEdit.id]);
  }

  onAddClick() {
    this.appCratePolicyModal()?.open({});
  }
}
