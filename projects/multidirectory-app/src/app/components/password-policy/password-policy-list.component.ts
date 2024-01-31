import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { switchMap } from "rxjs";
import { PasswordPolicy } from "../../core/password-policy/password-policy";
import { LdapWindowsService } from "../../services/ldap-windows.service";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ModalInjectDirective } from "multidirectory-ui-kit";

@Component({
    selector: 'password-policy-list',
    templateUrl: './password-policy-list.component.html',
    styleUrls: ['./password-policy-list.component.scss']
})
export class PasswordPolicyListComponent {
    @ViewChild('modalInject') appCratePolicyModal?: ModalInjectDirective;

    properties: any[] = [];

    clients: PasswordPolicy[] = [];
    constructor(
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private api: MultidirectoryApiService,
        private windows: LdapWindowsService) { ;
    }
    ngOnInit(): void {
        this.windows.showSpinner();
        this.api.getPasswordPolicy().subscribe(x => {
            this.clients = x;
            this.windows.hideSpinner();
        });
    }

    onDeleteClick(client: PasswordPolicy) {
        if(!client?.id) {
            return;
        }
        this.clients = this.clients.filter(x => x != client);
        this.api.deleteAccessPolicy(client.id).pipe(
            switchMap(() => this.api.getAccessPolicy())
        ).subscribe((clients) => {
            this.clients = clients.map(x => <PasswordPolicy><unknown>x);
        });
    }

    onEditClick(toEdit: PasswordPolicy) {
        alert('todo')
    }

    onAddClick() {
        this.appCratePolicyModal?.open({});
    }
}