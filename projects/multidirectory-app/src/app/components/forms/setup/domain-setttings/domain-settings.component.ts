import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SetupRequest } from "../../../../models/setup/setup-request";
import { SetupService } from "projects/multidirectory-app/src/app/services/setup.service";
import { MdFormComponent } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-domain-settings',
    templateUrl: './domain-settings.component.html',
    styleUrls: ['./domain-settings.component.scss']
})
export class DomainSettingsComponent implements AfterViewInit, OnDestroy {
    @Input() setupRequest!: SetupRequest;
    name = new FormControl('');
    @ViewChild('form') form!: MdFormComponent;
    unsubscribe = new Subject<void>();

    constructor(private setup: SetupService) {}
    
    ngAfterViewInit(): void {
        this.setup.stepValid(this.form.valid);
        this.setupRequest.domain = window.location.hostname;
        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(valid => {
            this.setup.stepValid(valid);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}