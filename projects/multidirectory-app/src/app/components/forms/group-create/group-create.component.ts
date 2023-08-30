import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";
import { GroupCreateRequest } from "../../../models/group-create/group-create.request";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CreateEntryRequest, LdapPartialAttribute } from "../../../models/entry/create-request";
import { ToastrService } from "ngx-toastr";
import { LdapEntity } from "../../../core/ldap/ldap-entity";

@Component({
    selector: 'app-group-create',
    templateUrl: './group-create.component.html',
    styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements AfterViewInit, OnDestroy {
    @ViewChild('createGroupModal') createGroupModal?: MdModalComponent;
    @ViewChild('groupForm', { static: true }) form!: MdFormComponent;

    _selectedNode: LdapEntity | null = null;
    @Input() set selectedNode(node: LdapEntity | null) {
        this._selectedNode = node;
        this.cdr.detectChanges();
    }
    get selectedNode(): LdapEntity | null {
        return this._selectedNode;
    }

    @Output() onCreate = new EventEmitter<void>();
    unsubscribe = new Subject<boolean>();
    formValid: boolean = false;
    _setupRequest = new GroupCreateRequest();
    @Input() set setupRequest(request: GroupCreateRequest) {
        this._setupRequest = request;
        this.form?.inputs.forEach(x => x.reset());
        this.cdr.detectChanges();
    }
    get setupRequest(): GroupCreateRequest {
        return this._setupRequest;
    }
    constructor(private cdr: ChangeDetectorRef, private api: MultidirectoryApiService, private toastr: ToastrService) {}
    
    ngAfterViewInit(): void {
        this.form?.onValidChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete()
        this.setupRequest = new GroupCreateRequest();
    }

    open() {
        this.createGroupModal?.open();
    }
    onClose() {
        this.setupRequest = new GroupCreateRequest();
    }
    onFinish() {
        this.createGroupModal?.showSpinner();
        this.api.create(new CreateEntryRequest({
            entry: `cn=${this.setupRequest.groupName},` + this.selectedNode?.id,
            attributes: [
                new LdapPartialAttribute({
                    type: 'objectClass',
                    vals: [ 'group', 'top' ]
                }),
            ]
        })).pipe(catchError(err => {
            this.createGroupModal?.hideSpinner();
            this.toastr.error('Не удалось создать группу');
            return EMPTY;
        })).subscribe(x => {
            this.createGroupModal?.hideSpinner();
            this.setupRequest = new GroupCreateRequest();
            this.createGroupModal?.close();
            this.onCreate.next();
        })
    }
}