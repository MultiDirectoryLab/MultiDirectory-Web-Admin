import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { EMPTY, catchError, switchMap, take, zip } from "rxjs";
import { translate } from "@ngneat/transloco";
import { ModalInjectDirective } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "@services/multidirectory-api.service";
import { AppWindowsService } from "@services/app-windows.service";
import { AccessPolicy } from "@core/access-policy/access-policy";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-access-policy-list',
    templateUrl: './access-policy-list.component.html',
    styleUrls: ['./access-policy-list.component.scss']
}) 
export class AccessPolicySettingsComponent implements OnInit {
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
        private windows: AppWindowsService) { ;
    }
    ngOnInit(): void {
        this.windows.showSpinner();
        this.api.getAccessPolicy().subscribe(x => {
            this.clients = x;
            this.windows.hideSpinner();
        });
    }

    onDeleteClick(client: AccessPolicy) {
        if(!client?.id) {
            return;
        }
        if(this.clients.length <= 1) {
            this.toastr.error(translate('access-policy-settings.must-be-enabled'));
            return;
        }
        this.clients = this.clients.filter(x => x != client);
        if(!this.clients.some(x => x.enabled)) {
            this.toastr.error(translate('access-policy-settings.must-be-enabled'));
            this.clients[0].enabled = true;
            return;
        }
        this.api.deleteAccessPolicy(client.id).pipe(
            switchMap(() => this.api.getAccessPolicy())
        ).subscribe((clients) => {
            this.clients = clients;
        });
    }

    onTurnOffClick(client: AccessPolicy) {
        if(!client.id) {
            return;
        }
        if(!this.clients.some(x => x.enabled)) {
            this.toastr.error(translate('access-policy-settings.must-be-enabled'));
            const toRevert = this.clients.find(x => x.id == client.id);
            if(toRevert) {
                setTimeout(() => toRevert.enabled = true);
            }
            this.cdr.detectChanges();
            return;
        }
        this.api.switchAccessPolicy(client.id).pipe(
            switchMap(x => this.api.getAccessPolicy())
        ).subscribe(x => {
            this.clients = x;
        })
    }

    onEditClick(toEdit: AccessPolicy) {
        if(!toEdit.id) {
            return;
        }
        this.accessClientCreateModal.open(
            { 'minHeight': 435 },
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
                return this.api.editAccessPolicy(this.clients[ind]);
            }),
            switchMap(() => this.api.getAccessPolicy())
        ).subscribe((clients) => {
            this.clients = clients;
        });
    }

    onAddClick() {
        this.accessClientCreateModal?.open(
            { 'minHeight': 435 },
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
                return this.api.saveAccessPolicy(client);
            }),
            catchError(err => {
                this.clients.pop();
                this.toastr.error(translate('access-policy-settings.unable-to-create-policy'));
                return EMPTY;
            }),
            switchMap(() => this.api.getAccessPolicy())
        ).subscribe((clients) => {
            this.clients = clients;
        });
    }

    onDrop(event: CdkDragDrop<string[]>) {
        const previous = this.clients[event.previousIndex];
        const current = this.clients[event.currentIndex];
        [this.clients[event.previousIndex], this.clients[event.currentIndex]] = [
            this.clients[event.currentIndex], this.clients[event.previousIndex]
        ];
        if(!previous.id || !current.id) {
            this.toastr.error(translate('access-policy-settings.policy-id-not-found'));
            return;
        }
        if(previous.id == current.id) {
            return;
        }
        this.api.swapAccessPolicies(previous.id, current.id).pipe(
            switchMap(() => this.api.getAccessPolicy())
        ).subscribe(result => {
            this.clients = result;
        })
    }
}