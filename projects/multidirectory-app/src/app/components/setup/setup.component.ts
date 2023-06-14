import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";
import { SetupRequest } from "../../models/setup/setup-request";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
    setupRequest = new SetupRequest();
    @ViewChild('form') form!: MdFormComponent;
    @ViewChild('modal') modal!: MdModalComponent;
    valid = false;
    unsubscribe = new Subject<boolean>();
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService, private router: Router, private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    
    ngAfterViewInit(): void {
        this.form.valid
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res: boolean) => {
                 this.valid = res;
                 this.cdr.detectChanges();
            });
    }

    onNext(templateRef: any) {
        this.modal.modalRoot!.resizeToContentHeight();
    }

    onSetup() {
        this.api.setup(this.setupRequest).pipe(
            catchError(err => {
                this.toastr.error(err);
                return EMPTY;
            })
        ).subscribe(res => {
            this.toastr.success('Настройка выполнена');
            this.router.navigate(['/'])
        });
    }
}