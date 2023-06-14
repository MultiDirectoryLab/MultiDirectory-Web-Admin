import { ChangeDetectorRef, Component, Input, forwardRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MdFormComponent } from "projects/multidirectory-ui-kit/src/lib/components/form/form.component";
import { SetupRequest } from "../../../models/setup/setup-request";

@Component({
    selector: 'app-domain-settings',
    templateUrl: './domain-settings.component.html',
    styleUrls: ['./domain-settings.component.scss'],
    providers: [
        {
            provide: MdFormComponent,
            useExisting: forwardRef(() => DomainSettingsComponent), 
            multi: true
        }
    ]
})
export class DomainSettingsComponent extends MdFormComponent {
    @Input() setupRequest!: SetupRequest;
    name = new FormControl('');

    constructor(cdr: ChangeDetectorRef) {
        super(cdr)
    }
}