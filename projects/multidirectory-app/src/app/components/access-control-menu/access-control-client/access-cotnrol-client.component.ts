import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { AccessControlClient } from "../../../core/access-control/access-control";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-acccess-control-client',
    templateUrl: './access-control-client.component.html',
    styleUrls: ['./access-control-client.component.scss']
})
export class AccessControlClientComponent implements AfterViewInit {
    @Input() index = 0;
    @Output() deleteClick = new EventEmitter<AccessControlClient>();
    @Output() turnOffClick = new EventEmitter<AccessControlClient>();
    @Output() editClick = new EventEmitter<AccessControlClient>();

    _accessClient: AccessControlClient | null = null;
    get accessClient(): AccessControlClient | null{
        return this._accessClient;
    }
    @Input() set accessClient(accessClient: AccessControlClient | null) {
        this._accessClient = accessClient;
        if(this._accessClient) {
            this.ipAddress = this._accessClient.ipRange.join(', ');
            this.groups = this._accessClient.groups.map(x => x.name).join(', ');
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