import { ErrorHandler, Inject, Injectable, Injector } from "@angular/core";
import { translate } from "@ngneat/transloco";
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
        if(error.error?.detail) {
            if(typeof error.error?.detail === 'string' || error.error?.detail instanceof String) {
                this.toastr.error(error.error.detail);
                return;
            }
            for(let i of error.error.detail) {
                this.toastr.error(i?.msg ?? i)
            }
            return;
        }
        this.toastr.error(
            error?.statusText ?? error?.message ?? translate("errors.unknown-error"), 
            '', 
            { onActivateTick: true }
        );
    }
}