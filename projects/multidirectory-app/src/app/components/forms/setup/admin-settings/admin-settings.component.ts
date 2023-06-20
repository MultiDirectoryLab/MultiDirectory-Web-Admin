import {  AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, ViewChild, forwardRef } from "@angular/core";
import { MdFormComponent } from "projects/multidirectory-ui-kit/src/lib/components/form/form.component";
import { SetupRequest } from "../../../../models/setup/setup-request";
import { Subject, takeUntil } from "rxjs";
import { SetupService } from "projects/multidirectory-app/src/app/services/setup.service";

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
export class AdminSettingsComponent implements AfterViewInit, OnDestroy {
    @Input() setupRequest!: SetupRequest;
    @ViewChild('form') form!: MdFormComponent;
    unsubscribe = new Subject<void>();

    constructor(private setup: SetupService) {}
    
    ngAfterViewInit(): void {
        this.setup.stepValid(this.form.valid);
        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(valid => {
            this.setup.stepValid(valid);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}