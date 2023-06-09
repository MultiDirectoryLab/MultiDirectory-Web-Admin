import { Component, forwardRef } from "@angular/core";
import { MdFormComponent } from "multidirectory-ui-kit";

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
    login: string = '';
    password: string = '';
}