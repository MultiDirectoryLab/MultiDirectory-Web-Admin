import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { MdFormComponent, MdModalComponent, ModalInjectDirective } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { ChangePasswordRequest } from "projects/multidirectory-app/src/app/models/user/change-password-request";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";



@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements AfterViewInit, OnDestroy {
    @ViewChild('form') form!: MdFormComponent;
    unsubscribe = new Subject<boolean>();
    formValid = false;
    changeRequest = new ChangePasswordRequest();
    repeatPassword = '';
    un = '';
    constructor(
        private toastr: ToastrService,
        private api: MultidirectoryApiService,
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {

    }
    
    ngAfterViewInit(): void {
        if(!!this.modalControl?.contentOptions?.identity) {
            this.changeRequest.identity =  this.modalControl.contentOptions.identity;
            this.un = this.modalControl.contentOptions.un;
        }

        this.formValid = this.form.valid;
        this.form.onValidChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
    }


    close() {
        this.modalControl.close(undefined);
    }

    finish() {
        this.modalControl.modal?.showSpinner();
        this.api.changePassword(this.changeRequest).pipe(
            catchError(err => {
                this.toastr.error(translate('change-password.unable-change-password'));
                this.modalControl.close(false);
                return EMPTY;
            })
        ).subscribe(x => {
            this.modalControl.modal?.hideSpinner();
            this.modalControl.close(x);
        });
    }

    checkModel() {
        this.form.validate();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
}