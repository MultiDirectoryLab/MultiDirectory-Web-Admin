import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AccessControlClientCreateComponent } from "./access-control-client-create/access-control-client-create.component";
import { take } from "rxjs";
import { AccessControlClient, GroupSelection } from "../../../core/access-control/access-control";

@Component({
    selector: 'app-access-control-menu',
    templateUrl: './access-control-menu.component.html',
    styleUrls: ['./access-control-menu.component.scss']
}) 
export class AccessControlMenuComponent {
    @ViewChild('createModal', { static: true }) accessClientCreateModal: AccessControlClientCreateComponent | null = null;

    properties: any[] = [];
    propColumns = [
        { name: '№', prop: 'no', flexGrow: 1 },
        { name: 'Домен', prop: 'name', flexGrow: 2 },
        { name: 'Диапазон адресов', prop: 'addressRanges', flexGrow: 2 },
        { name: 'Включить', prop: 'enabled', flexGrow: 2 }
    ];


    clients = [
        new AccessControlClient({ 
            domain: 'app.test.ru',
            enabled: true,
            groups: [],
            ipRange: ['127.0.0.1', '127.0.0.2']
        }),
        new AccessControlClient({
            domain: 'dev.local.ru',
            enabled: false,
            groups: [new GroupSelection({
                name: 'administrators',
                dn: ''
            })],
            ipRange: ['94.32.123.12']
        })
    ];
    constructor(private toastr: ToastrService) {}



    onDeleteClick(client: AccessControlClient) {
        if(this.clients.length <= 1) {
            this.toastr.error('Один клиент должен быть включен');
            return;
        }
        this.clients = this.clients.filter(x => x != client);
        if(!this.clients.some(x => x.enabled)) {
            this.toastr.error('Один клиент должен быть включен');
            this.clients[0].enabled = true;
            return;
        }
    }

    onTurnOffClick(client: AccessControlClient) {
        if(!this.clients.some(x => x.enabled)) {
            this.toastr.error('Один клиент должен быть включен');
            client.enabled = true;
            return;
        }
    }

    onEditClick(toEdit: AccessControlClient) {
        this.accessClientCreateModal?.open(
            new AccessControlClient(toEdit)
        ).pipe(take(1)).subscribe(client => {
            if(!client) {
                return;
            }
            const ind = this.clients.findIndex(x => x == toEdit);
            Object.assign(this.clients[ind], client);
        });
    }

    onAddClick() {
        this.accessClientCreateModal?.open(
            new AccessControlClient()
        ).pipe(take(1)).subscribe(client => {
            console.log('test', client);
            if(!client) {
                return;
            }
            this.clients.push(client);
        });
    }
}