import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserCreateService {
    private _stepValid = new BehaviorSubject<boolean>(false);
    get onStepValid() {
        return this._stepValid.asObservable();
    }

    stepValid(valid: boolean) {
        this._stepValid.next(valid);
    }
}