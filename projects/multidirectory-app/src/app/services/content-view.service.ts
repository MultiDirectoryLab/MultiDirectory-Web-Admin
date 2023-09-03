import { Injectable } from "@angular/core";
import { ViewMode } from "../components/catalog-content/view-modes";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContentViewService {
    private _contentViewRx = new BehaviorSubject(ViewMode.Table);
    get contentViewRx(): Observable<ViewMode> {
        return this._contentViewRx.asObservable();
    }

    get contentView(): ViewMode {
        return this._contentViewRx.getValue();
    }
    set contentView(mode: ViewMode) {
        this._contentViewRx.next(mode);
    }
}