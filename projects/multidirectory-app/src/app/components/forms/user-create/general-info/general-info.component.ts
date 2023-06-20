import { AfterViewInit, Component, Input, OnDestroy, ViewChild, forwardRef } from "@angular/core";
import { LdapNode } from "../../../../core/ldap/ldap-tree-builder";
import { UserCreateRequest } from "projects/multidirectory-app/src/app/models/user-create/user-create.request";
import { MdFormComponent } from "projects/multidirectory-ui-kit/src/public-api";
import { Subject, takeUntil } from "rxjs";
import { UserCreateService } from "projects/multidirectory-app/src/app/services/user-create.service";

@Component({
    selector: 'app-user-create-general-info', 
    styleUrls: ['./general-info.component.scss'],
    templateUrl: './general-info.component.html',
    providers: [
        {
            provide: MdFormComponent,
            useExisting: forwardRef(() => UserCreateGeneralInfoComponent),  // replace name as appropriate
            multi: true
        }
    ]
})
export class UserCreateGeneralInfoComponent implements AfterViewInit, OnDestroy {
    @Input() selectedNode!: LdapNode;
    @Input() setupRequest!: UserCreateRequest;
    @ViewChild('form') form!: MdFormComponent;
    unsubscribe = new Subject<void>();
    constructor(public setup: UserCreateService) {}
    ngAfterViewInit(): void {
        this.setup.stepValid(this.form.valid)
        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            this.setup.stepValid(this.form.valid);
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onNameChange() {
        this.setupRequest.fullName = 
            `${this.setupRequest.firstName} ${this.setupRequest.initials} ${this.setupRequest.lastName}`;
    }
}