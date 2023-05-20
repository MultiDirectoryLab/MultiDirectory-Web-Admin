import { Component, OnDestroy } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    unsubscribe = new Subject<boolean>();
    constructor(private app: AppSettingsService) {
        app.hideNavigationalPanelRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(val => {
            this.leftPaneHidden = val
        }) 
    }

    _leftPaneHidden = false;
    get leftPaneHidden() {
        return this._leftPaneHidden;
    }
    set leftPaneHidden(val: boolean) {
        this._leftPaneHidden = val;
        this.app.showNavigationalPanel(val);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    test() {
        alert('test');
    }
}