import { Component, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from "@angular/core";
import { MdFormComponent } from "multidirectory-ui-kit";
import { MdModalComponent } from "projects/multidirectory-ui-kit/src/lib/components/modal/modal.component";
import { SetupRequest } from "../../../models/setup/setup-request";

@Component({
    selector: 'app-admin-settings-second',
    templateUrl: './admin-settings-second.component.html',
    styleUrls: ['./admin-settings-second.component.scss'],
    providers: [
        {
            provide: MdFormComponent,
            useExisting: forwardRef(() => AdminSettingsSecondComponent),  // replace name as appropriate
            multi: true
        }
    ]
})
export class AdminSettingsSecondComponent extends MdFormComponent implements OnInit {
    @Input() setupRequest!: SetupRequest;
    @Input() modalForm!: MdModalComponent;

    ngOnInit(): void {
        const url = new URL(this.setupRequest.domain);
        const domain = url.hostname;
        console.log(domain);
        this.setupRequest.user_principal_name = `${this.setupRequest.username}@${domain}`;
        this.setupRequest.display_name = this.setupRequest.username;
        this.setupRequest.mail = this.setupRequest.user_principal_name;
    }
}