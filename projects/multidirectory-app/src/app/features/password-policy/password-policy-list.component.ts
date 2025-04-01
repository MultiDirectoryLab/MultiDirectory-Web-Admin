import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdModalModule, ModalInjectDirective } from 'multidirectory-ui-kit';
import { switchMap } from 'rxjs';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { PasswordPolicyListItemComponent } from './password-policy-list-item/password-policy-list-item.component';
import { PasswordPolicyCreateComponent } from './password-policy-create/password-policy-create.component';

@Component({
  selector: 'password-policy-list',
  templateUrl: './password-policy-list.component.html',
  styleUrls: ['./password-policy-list.component.scss'],
  standalone: true,
  imports: [PasswordPolicyListItemComponent, MdModalModule, PasswordPolicyCreateComponent],
})
export class PasswordPolicyListComponent implements OnInit {
  @ViewChild('modalInject') appCratePolicyModal?: ModalInjectDirective;

  properties: any[] = [];

  clients: PasswordPolicy[] = [];

  constructor(
    private api: MultidirectoryApiService,
    private router: Router,
    private windows: AppWindowsService,
  ) {}

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
    this.appCratePolicyModal?.open({});
  }
}
