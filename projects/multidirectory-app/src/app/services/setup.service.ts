import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SetupRequest } from "../models/setup/setup-request";

@Injectable({
    providedIn: 'root'
})
export class SetupService {
    setupRequest = new SetupRequest();

    private _stepValid = new BehaviorSubject<boolean>(false);
    get onStepValid() {
        return this._stepValid.asObservable();
    }

    stepValid(valid: boolean) {
        this._stepValid.next(valid);
    }
}