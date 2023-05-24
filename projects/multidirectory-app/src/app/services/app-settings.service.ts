import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AppSettingsService {
    navigationalPanelVisibleRx = new BehaviorSubject<boolean>(true)

    setNavigationalPanelVisiblity(state: boolean) {
        this.navigationalPanelVisibleRx.next(state);
    }
}