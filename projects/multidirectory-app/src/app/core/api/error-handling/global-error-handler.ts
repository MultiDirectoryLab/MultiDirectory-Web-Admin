import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { translate } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly injector = inject<Injector>(Injector);
  private router = inject(Router);

  private _toastr?: ToastrService;
  private get toastr() {
    if (!this._toastr) {
      this._toastr = this.injector.get(ToastrService);
    }
    return this._toastr;
  }

  handleError(error: any) {
    if (error.error instanceof ProgressEvent) {
      this.router.navigate(['/enable-backend']);
      return;
    }

    if (error.error?.detail) {
      if (error.status == 451) {
        this.toastr.error(translate('errors.license-problem'));
        return;
      }
      return;
    }
  }
}
