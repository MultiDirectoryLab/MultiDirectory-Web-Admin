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
    console.error(error);
    if (error.error instanceof ProgressEvent) {
      this.router.navigate(['/enable-backend']);
      return;
    }
    if (error.error?.detail) {
      if (typeof error.error?.detail === 'string' || error.error?.detail instanceof String) {
        this.toastr.error(error.error.detail);
        return;
      }
      for (const i of error.error.detail) {
        this.toastr.error(i?.msg ?? i);
      }
      return;
    }
    this.toastr.error(error?.statusText ?? translate('errors.unknown-error'), '', {
      onActivateTick: true,
    });
  }
}
