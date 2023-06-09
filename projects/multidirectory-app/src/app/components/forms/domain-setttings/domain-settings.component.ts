import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, forwardRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MdFormComponent } from "multidirectory-ui-kit";

@Component({
    selector: 'app-domain-settings',
    templateUrl: './domain-settings.component.html',
    styleUrls: ['./domain-settings.component.scss'],
    providers: [
        {
            provide: MdFormComponent,
            useExisting: forwardRef(() => DomainSettingsComponent),  // replace name as appropriate
            multi: true
        }
    ]
})
export class DomainSettingsComponent extends MdFormComponent {
    @Input() domain: string = '';
    name = new FormControl('');

    constructor(private cdr: ChangeDetectorRef) {
        super()
    }
}