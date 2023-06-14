import {  ChangeDetectorRef, Component, Input, forwardRef } from "@angular/core";
import { MdFormComponent } from "projects/multidirectory-ui-kit/src/lib/components/form/form.component";
import { SetupRequest } from "../../../models/setup/setup-request";

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.scss'],
    providers: [
        {
            provide: MdFormComponent,
            useExisting: forwardRef(() => AdminSettingsComponent), 
            multi: true
        }
    ]
})
export class AdminSettingsComponent extends MdFormComponent {
    @Input() setupRequest!: SetupRequest;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr)
    }
}