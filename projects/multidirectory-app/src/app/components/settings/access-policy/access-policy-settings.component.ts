import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { EMPTY, switchMap, take, zip } from "rxjs";
import { AccessPolicy } from "../../../core/access-policy/access-policy";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { CdkDragDrop, CdkDragEnd } from "@angular/cdk/drag-drop";
import { ModalInjectDirective } from "multidirectory-ui-kit";

@Component({
    selector: 'app-access-policy-settings',
    templateUrl: './access-policy-settings.component.html',
    styleUrls: ['./access-policy-settings.component.scss']
}) 
export class AccessPolicySettingsComponent {
    @ViewChild('createModal', { static: true }) accessClientCreateModal!: ModalInjectDirective;

    properties: any[] = [];
    propColumns = [
        { name: '№', prop: 'no', flexGrow: 1 },
        { name: 'Домен', prop: 'name', flexGrow: 2 },
        { name: 'Диапазон адресов', prop: 'addressRanges', flexGrow: 2 },
        { name: 'Включить', prop: 'enabled', flexGrow: 2 }
    ];


    clients: AccessPolicy[] = [];
    constructor(
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService) {
        this.api.getPolicy().subscribe(x => {
            this.clients = x;
            console.log(this.clients);
        });
        this.navigation.init();
    }

    onDeleteClick(client: AccessPolicy) {
        if(!client?.id) {
            return;
        }
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
        this.api.deletePolicy(client.id).pipe(
            switchMap(() => this.api.getPolicy())
        ).subscribe((clients) => {
            this.clients = clients;
        });
    }

    onTurnOffClick(client: AccessPolicy) {
        if(!client.id) {
            return;
        }
        if(!this.clients.some(x => x.enabled)) {
            this.toastr.error('Один клиент должен быть включен');
            const toRevert = this.clients.find(x => x.id == client.id);
            if(toRevert) {
                setTimeout(() => toRevert.enabled = true);
            }
            this.cdr.detectChanges();
            return;
        }
        this.api.switchPolicy(client.id).pipe(
            switchMap(x => this.api.getPolicy())
        ).subscribe(x => {
            this.clients = x;
        })
    }

    onEditClick(toEdit: AccessPolicy) {
        if(!toEdit.id) {
            return;
        }
        this.accessClientCreateModal.open(
            undefined,
            { 'accessPolicy': new AccessPolicy(toEdit).setId(toEdit.id) }
        ).pipe(
            take(1),
            switchMap(client => {
                if(!client?.id) {
                    return EMPTY;
                }
                const ind = this.clients.findIndex(x => x.id == toEdit.id);
                this.clients[ind] = new AccessPolicy(client);
                this.clients[ind].setId(client.id);
                return this.api.editPolicy(this.clients[ind]);
            }),
            switchMap(() => this.api.getPolicy())
        ).subscribe((clients) => {
            this.clients = clients;
        });
    }

    onAddClick() {
        this.accessClientCreateModal?.open(
            undefined,
            { 'accessPolicy': new AccessPolicy() }
        ).pipe(
            take(1),
            switchMap(client => {
                if(!client) {
                    return EMPTY;
                }
                delete client.id;
                client.priority = (this.clients.length + 1) * 10;
                this.clients.push(new AccessPolicy(client));
                return this.api.savePolicy(client);
            }),
            switchMap(() => this.api.getPolicy())
        ).subscribe((clients) => {
            this.clients = clients;
        });
    }

    onDrop(event: CdkDragDrop<string[]>) {
        const previous = this.clients[event.previousIndex];
        console.log(previous);
        const current = this.clients[event.currentIndex];
        [this.clients[event.previousIndex], this.clients[event.currentIndex]] = [
            this.clients[event.currentIndex], this.clients[event.previousIndex]
        ];
        if(!previous.id || !current.id) {
            this.toastr.error('У этих политик не задан ID');
            return;
        }
        if(previous.id == current.id) {
            return;
        }
        this.api.swapPolicies(previous.id, current.id).pipe(
            switchMap(() => this.api.getPolicy())
        ).subscribe(result => {
            this.clients = result;
        })
    }
}