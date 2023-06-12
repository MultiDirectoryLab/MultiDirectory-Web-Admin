import { Component, Input, OnChanges, SimpleChanges, forwardRef } from "@angular/core";
import { MdFormComponent } from "multidirectory-ui-kit";
import { MdModalComponent } from "projects/multidirectory-ui-kit/src/lib/components/modal/modal.component";
import { SetupRequest } from "../../../models/setup/setup-request";

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.scss'],
    providers: [
        {
            provide: MdFormComponent,
            useExisting: forwardRef(() => AdminSettingsComponent),  // replace name as appropriate
            multi: true
        }
    ]
})
export class AdminSettingsComponent extends MdFormComponent {
    @Input() setupRequest!: SetupRequest;
    @Input() modalForm!: MdModalComponent;
}