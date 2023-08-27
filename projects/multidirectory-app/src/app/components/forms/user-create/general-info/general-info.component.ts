import { AfterViewInit, Component, Input, OnDestroy, QueryList, ViewChild, ViewChildren, forwardRef } from "@angular/core";
import { LdapEntity } from "../../../../core/ldap/ldap-loader";
import { UserCreateRequest } from "projects/multidirectory-app/src/app/models/user-create/user-create.request";
import { Subject, takeUntil } from "rxjs";
import { UserCreateService } from "projects/multidirectory-app/src/app/services/user-create.service";
import { AbstractControl } from "@angular/forms";
import { MdFormComponent } from "multidirectory-ui-kit";

@Component({
    selector: 'app-user-create-general-info', 
    styleUrls: ['./general-info.component.scss'],
    templateUrl: './general-info.component.html'
})
export class UserCreateGeneralInfoComponent implements AfterViewInit, OnDestroy {
    @Input() selectedNode: LdapEntity | null = null;
    private _setupRequest!: UserCreateRequest;
    @Input() set setupRequest(request: UserCreateRequest) {
        this._setupRequest = request;
        this.form?.inputs.forEach(x => x.reset());
    }
    get setupRequest(): UserCreateRequest {
        return this._setupRequest;
    }

    @ViewChild('form') form!: MdFormComponent;
    @ViewChildren(AbstractControl) controls!: QueryList<AbstractControl>;

    unsubscribe = new Subject<void>();
    constructor(public setup: UserCreateService) {}
    ngAfterViewInit(): void {
        this.setup.stepValid(this.form.valid)
        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            this.setup.stepValid(this.form.valid);
        })
    }

    ngOnDestroy(): void {
        this.form.inputs.forEach(x => x.reset());
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onNameChange() {
        this.setupRequest.fullName = 
            `${this.setupRequest.firstName} ${this.setupRequest.initials} ${this.setupRequest.lastName}`;
    }
}