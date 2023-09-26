import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AccessPolicy } from "projects/multidirectory-app/src/app/core/access-policy/access-policy";

@Component({
    selector: 'app-acccess-policy',
    templateUrl: './access-policy.component.html',
    styleUrls: ['./access-policy.component.scss']
})
export class AccessPolicyComponent implements AfterViewInit {
    @Input() index = 0;
    @Output() deleteClick = new EventEmitter<AccessPolicy>();
    @Output() turnOffClick = new EventEmitter<AccessPolicy>();
    @Output() editClick = new EventEmitter<AccessPolicy>();

    _accessClient: AccessPolicy | null = null;
    get accessClient(): AccessPolicy | null{
        return this._accessClient;
    }
    @Input() set accessClient(accessClient: AccessPolicy | null) {
        this._accessClient = accessClient;
        if(this._accessClient) {
            this.ipAddress = this._accessClient.ipRange.join(', ');
            this.groups = this._accessClient.groups.map(x => x).join(', ');
        }
    } 

    ipAddress = '';
    groups = '';
    constructor(private toastr: ToastrService) {}

    ngAfterViewInit(): void {
    }

    onDeleteClick() {
        if(!this.accessClient) {
            this.toastr.error('Этого клиента не существует');
            return;
        }
        this.deleteClick.emit(this.accessClient);
    }

    onTurnOffClick() {
        if(!this.accessClient) {
            this.toastr.error('Этого клиента не существует');
            return;
        }
        this.turnOffClick.emit(this.accessClient);
    }

    
    onEditClick() {
        if(!this.accessClient) {
            this.toastr.error('Этого клиента не существует');
            return;
        }
        this.editClick.emit(this.accessClient);
    }
}