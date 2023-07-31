import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Inject, Injectable, Injector } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(@Inject(Injector) private readonly injector: Injector) {}
    
    private _toastr?: ToastrService; 
    private get toastr() {
        if(!this._toastr) {
            this._toastr = this.injector.get(ToastrService);
        }
        return this._toastr;
    }

    handleError(error: any) {
        console.error(error);
        this.toastr.error(error?.statusText ?? error)?.message;
    }
}