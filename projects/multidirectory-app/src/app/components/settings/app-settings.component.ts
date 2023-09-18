import { Component, OnDestroy } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-settings',
    templateUrl: './app-settings.component.html',
    styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnDestroy {
    user: WhoamiResponse | null = null;
    unsubscribe = new Subject<void>();

    constructor(private app: AppSettingsService) {
        this.app.userRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(user => {
            this.user = user;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}