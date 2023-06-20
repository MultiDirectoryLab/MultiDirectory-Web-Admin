import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MdFormComponent, MdModalComponent, StepperComponent } from "multidirectory-ui-kit";
import { LdapNode } from "../../../core/ldap/ldap-tree-builder";
import { UserCreateRequest } from "../../../models/user-create/user-create.request";
import { Subject, takeUntil } from "rxjs";
import { UserCreateService } from "../../../services/user-create.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CreateEntryRequest, LdapPartialAttribute } from "../../../models/entry/create-request";
 
@Component({
    selector: 'app-ou-create',
    templateUrl: './ou-create.component.html',
    styleUrls: ['./ou-create.component.scss']
})
export class OuCreateComponent implements AfterViewInit, OnDestroy {
    @Input() selectedNode?: LdapNode;
    @Output() onCreate = new EventEmitter<void>();
    @ViewChild('createOuModal') createOuModal?: MdModalComponent;
    @ViewChild('form') form!: MdFormComponent;

    setupRequest = '';
    unsubscribe = new Subject<void>();
    formValid = false;

    constructor(private setup: UserCreateService, private api: MultidirectoryApiService) {}

    open() {
        this.createOuModal?.open();
    }

    onFinish() {
        this.api.create(new CreateEntryRequest({
            entry: `cn=${this.setupRequest},` + this.selectedNode?.id,
            attributes: [new LdapPartialAttribute({
              type: 'objectClass',
              vals: [
              'top', 'container', 'organizationalUnit'
              ]
            }),
          ]
        })).subscribe(x => {
          this.onCreate.emit();
          this.onClose();
        });
    }

    ngAfterViewInit(): void {
        this.formValid = this.form.valid;
        this.form.onValidChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
    }

    ngOnDestroy(): void {
        this.setupRequest = '';
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onClose(): void {
        this.setupRequest = '';
        this.createOuModal?.close();
    }
}