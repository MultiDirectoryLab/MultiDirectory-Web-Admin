import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AppSettingsService {
    hideNavigationalPanelRx = new BehaviorSubject<boolean>(true)

    showNavigationalPanel(state: boolean) {
        this.hideNavigationalPanelRx.next(state);
    }
}