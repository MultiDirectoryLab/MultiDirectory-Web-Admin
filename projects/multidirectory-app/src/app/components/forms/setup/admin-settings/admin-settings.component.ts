import { AfterViewInit, Component, Input, OnDestroy, ViewChild, forwardRef } from "@angular/core";
import { MdFormComponent } from "multidirectory-ui-kit";
import { SetupService } from "projects/multidirectory-app/src/app/services/setup.service";
import { Subject, take, takeUntil } from "rxjs";
import { SetupRequest } from "../../../../models/setup/setup-request";

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

        this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.form.validate();
        });

        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(valid => {
            this.setup.stepValid(valid);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}