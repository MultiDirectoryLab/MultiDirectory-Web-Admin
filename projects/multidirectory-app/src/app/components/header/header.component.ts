import { Component, OnDestroy } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject } from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    unsubscribe = new Subject<boolean>();
    navigationalPanelVisible = true;

    constructor(private app: AppSettingsService) {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onChange(value: boolean) {
        this.navigationalPanelVisible = value;
        this.app.setNavigationalPanelVisiblity(value);
        window.dispatchEvent(new Event('resize'));
    }
}