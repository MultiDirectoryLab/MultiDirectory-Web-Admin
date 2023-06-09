import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MdFormComponent } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
    password = '';
    login = '';
    domain = '';
    valid = false;
    @ViewChild('form') form!: MdFormComponent;
    unsubscribe = new Subject<boolean>();
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService, private router: Router) {
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
            .subscribe(res => this.valid = res);
    }

    onNext(templateRef: any) {
        
    }

    onSetup() {
        this.api.setup({
            login: this.login,
            domain: this.domain,
            password: this.password
        }).subscribe(res => {
            this.toastr.success('Настройка выполнена');
            this.router.navigate(['/'])
        })
    }
}