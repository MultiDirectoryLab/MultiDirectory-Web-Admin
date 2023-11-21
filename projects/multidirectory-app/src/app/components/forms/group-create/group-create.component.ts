import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, ViewChild } from "@angular/core";
import { MdFormComponent, ModalInjectDirective } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { PartialAttribute } from "../../../core/ldap/ldap-partial-attribute";
import { CreateEntryRequest } from "../../../models/entry/create-request";
import { GroupCreateRequest } from "../../../models/group-create/group-create.request";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { translate } from "@ngneat/transloco";

@Component({
    selector: 'app-group-create',
    templateUrl: './group-create.component.html',
    styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements AfterViewInit, OnDestroy {
    @ViewChild('groupForm', { static: true }) private _form!: MdFormComponent;
    private _unsubscribe = new Subject<boolean>();
    private _setupRequest = new GroupCreateRequest();
    selectedNode: LdapEntity | null = null;
    formValid: boolean = false;


    @Input() set setupRequest(request: GroupCreateRequest) {
        this._setupRequest = request;
        this._form?.inputs.forEach(x => x.reset());
        this.cdr.detectChanges();
    }
    get setupRequest(): GroupCreateRequest {
        return this._setupRequest;
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private api: MultidirectoryApiService,
        private toastr: ToastrService,
        private navigation: LdapNavigationService,
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {}
    
    ngAfterViewInit(): void {
        this._form?.onValidChanges.pipe(
            takeUntil(this._unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
        this.selectedNode = this.navigation.selectedCatalog;
    }

    ngOnDestroy(): void {
        this._unsubscribe.next(true);
        this._unsubscribe.complete()
        this.setupRequest = new GroupCreateRequest();
    }


    onClose() {
        this.setupRequest = new GroupCreateRequest();
        this.modalControl.close(null);
    }

    onFinish(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        if(!this.formValid) {
            this.toastr.error(translate('please-check-errors'));
            this._form.validate();
            return;
        }
        this.modalControl?.modal?.showSpinner();
        this.api.create(new CreateEntryRequest({
            entry: `cn=${this.setupRequest.groupName},` + this.selectedNode?.id,
            attributes: [
                new PartialAttribute({
                    type: 'objectClass',
                    vals: [ 'group', 'top', 'posixGroup' ]
                }),
            ]
        })).pipe(catchError(err => {
            this.modalControl.modal?.hideSpinner();
            this.toastr.error(translate('group-create.unable-create-group'));
            this.modalControl.close(null);
            return EMPTY;
        })).subscribe(x => {
            this.modalControl?.modal?.hideSpinner();
            this.setupRequest = new GroupCreateRequest();
            this.modalControl?.close(x);
        })
    }
}