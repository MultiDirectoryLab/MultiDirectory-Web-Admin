import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MdModalComponent, SpinnerComponent } from "multidirectory-ui-kit";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";
import { SetupRequest } from "../../models/setup/setup-request";
import { SetupService } from "../../services/setup.service";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
    setupRequest = new SetupRequest();
    @ViewChild('modal') modal!: MdModalComponent;

    stepValid = false;
    unsubscribe = new Subject<boolean>();
    constructor(
        private api: MultidirectoryApiService,
        private setup: SetupService,
        private toastr: ToastrService,
        private router: Router,
        private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.setup.onStepValid.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(valid => {
            this.stepValid = valid;
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    
    ngAfterViewInit(): void {
    }

    onNext(templateRef: any) {
        this.modal.modalRoot!.resizeToContentHeight();
    }

    onSetup() {
        this.modal.showSpinner();
        this.api.setup(this.setupRequest).pipe(
            catchError(err => {
                this.toastr.error(err);
                return EMPTY;
            })
        ).subscribe(res => {
            this.modal.hideSpinner();
            this.toastr.success('Настройка выполнена');
            this.router.navigate(['/'])
        });
    }

    resize()  {
        this.cdr.detectChanges();
        this.modal.modalRoot?.resizeToContentHeight();
        this.cdr.detectChanges();
    }
}