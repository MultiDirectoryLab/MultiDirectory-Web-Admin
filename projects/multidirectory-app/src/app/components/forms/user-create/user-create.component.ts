import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MdModalComponent, StepperComponent } from "multidirectory-ui-kit";
import { LdapNode } from "../../../core/ldap/ldap-tree-builder";
import { UserCreateRequest } from "../../../models/user-create/user-create.request";
import { Subject, takeUntil } from "rxjs";
import { UserCreateService } from "../../../services/user-create.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CreateEntryRequest, LdapPartialAttribute } from "../../../models/entry/create-request";
 
@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements AfterViewInit, OnDestroy {
    @Input() selectedNode?: LdapNode;
    @Output() onCreate = new EventEmitter<void>();
    @ViewChild('createUserModal') createUserModal?: MdModalComponent;
    @ViewChild('createUserStepper') stepper!: StepperComponent;
    setupRequest = new UserCreateRequest();
    unsubscribe = new Subject<void>();
    formValid = false;
    constructor(private setup: UserCreateService, private api: MultidirectoryApiService) {}
    open() {
        this.createUserModal?.open();
    }

    onFinish() {
        this.api.create(new CreateEntryRequest({
              entry: `cn=${this.setupRequest.upnLogin},` + this.selectedNode?.id,
              attributes: [new LdapPartialAttribute({
                type: 'objectClass',
                vals: ['user',
                'top', 'person', 'organizationalPerson', 'posixAccount'
                ]
              }),
              new LdapPartialAttribute({
                type: 'password',
                vals: [ '$2a$12$4yK2pbnlGgGGfCe/ACJ1YOYgO/MHJvKmmU2VV3yFsZ6yee0D.kAX2']
              }),
              new LdapPartialAttribute({
                type: 'mail',
                vals: [this.setupRequest.upnLogin  + '@' + this.setupRequest.upnDomain]
              }),
              new LdapPartialAttribute({
                type: 'sAMAccountName',
                vals: [this.setupRequest.upnLogin]
              }),
              new LdapPartialAttribute({
                type: 'userPrincipalName',
                vals: [this.setupRequest.upnLogin  + '@' + this.setupRequest.upnDomain]
              }),
              new LdapPartialAttribute({
                type: 'displayName',
                vals: [this.setupRequest.upnLogin]
              })
            ]
        })).subscribe(x => {
            this.onCreate.emit();
            this.createUserModal?.close();
        });
    }

    ngAfterViewInit(): void {
        this.setup.onStepValid.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
    }

    ngOnDestroy(): void {
        this.setupRequest = new UserCreateRequest();
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onClose(): void {
        this.setupRequest = new UserCreateRequest();
        this.stepper.reset();
    }
}