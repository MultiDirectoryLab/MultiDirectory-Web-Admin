import { AfterViewInit, Component, Input, OnDestroy, QueryList, ViewChild, ViewChildren, forwardRef } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AbstractControl } from "@angular/forms";
import { DropdownOption, MdFormComponent } from "multidirectory-ui-kit";
import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { UserCreateService } from "projects/multidirectory-app/src/app/services/user-create.service";
import { UserCreateRequest } from "projects/multidirectory-app/src/app/models/user-create/user-create.request";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";

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
    domains: DropdownOption[] = []
    constructor(public setup: UserCreateService, private navigation: LdapNavigationService) {}
    ngAfterViewInit(): void {
        this.setup.stepValid(this.form.valid)
        this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.form.validate();
        });
        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            this.setup.stepValid(this.form.valid);
        })

        this.domains = this.navigation.getRootDse().map(x => new DropdownOption({
            title: x.node?.name,
            value: x.node?.name
        }));
        this.setupRequest.upnDomain = this.domains?.[0]?.value;
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