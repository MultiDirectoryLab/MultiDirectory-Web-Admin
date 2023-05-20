import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AppSettingsService {
    
    private _showLeftPane = false;
    showLeftPaneRx = new BehaviorSubject<boolean>(true)

    showLeftPane(state: boolean) {
        this._showLeftPane = state;
        this.showLeftPaneRx.next(state);
    }

    toggleLeftPane() {
        this._showLeftPane = !this._showLeftPane;
        this.showLeftPaneRx.next(this._showLeftPane);
    }
}