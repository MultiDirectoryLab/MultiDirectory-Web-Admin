import { Component, EventEmitter, ViewChild } from "@angular/core";
import { DropdownOption, MdModalComponent } from "multidirectory-ui-kit";
import { AccessControlClient } from "../../../core/access-control/access-control";
import { Observable } from "rxjs";
import { MfaAccessEnum } from "../../../core/access-control/mfa-access-enum";

@Component({
    selector: 'app-access-control-client-create',
    templateUrl: './access-control-client-create.component.html',
    styleUrls: ['./access-control-client-create.component.scss']
})
export class AccessControlClientCreateComponent {
    @ViewChild('accessControlCreateModal') modal!: MdModalComponent;
    accessClient = new AccessControlClient();
    ipAddresses = '';
    mfaAccess = MfaAccessEnum.SelectedGroups;
    options: DropdownOption[] = [ 
        { title: 'Всем', value: MfaAccessEnum.Everyone },
        { title: 'Никому', value: MfaAccessEnum.Noone },
        { title: 'Выбранным группам', value: MfaAccessEnum.SelectedGroups }
    ];

    onSave = new EventEmitter<AccessControlClient | null>();

    open(client: AccessControlClient): Observable<AccessControlClient | null> {
        this.accessClient = client;
        this.modal.open();
        return this.onSave.asObservable();
    }

    close() {
        this.onSave.emit(null);
        this.modal.close();
    }

    save() {
        this.onSave.emit(this.accessClient);
        this.modal.close();
    }
}