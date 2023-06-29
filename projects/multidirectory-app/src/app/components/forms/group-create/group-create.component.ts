import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { LdapNode } from "../../../core/ldap/ldap-tree-builder";
import { MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";
import { GroupCreateRequest } from "../../../models/group-create/group-create.request";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CreateEntryRequest, LdapPartialAttribute } from "../../../models/entry/create-request";

@Component({
    selector: 'app-group-create',
    templateUrl: './group-create.component.html',
    styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements AfterViewInit, OnDestroy {
    @ViewChild('createGroupModal') createGroupModal?: MdModalComponent;
    @ViewChild('groupForm', { static: true }) form!: MdFormComponent;

    _selectedNode?: LdapNode;
    @Input() set selectedNode(node: LdapNode | undefined) {
        this._selectedNode = node;
        this.cdr.detectChanges();
        this.ngAfterViewInit();
    }
    get selectedNode(): LdapNode | undefined {
        return this._selectedNode;
    }

    @Output() onCreate = new EventEmitter<void>();
    unsubscribe = new Subject<boolean>();
    formValid: boolean = false;
    setupRequest = new GroupCreateRequest();
    constructor(private cdr: ChangeDetectorRef, private api: MultidirectoryApiService) {}
    
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
        this.api.create(new CreateEntryRequest({
            entry: `cn=${this.setupRequest.groupName},` + this.selectedNode?.id,
            attributes: [
                new LdapPartialAttribute({
                    type: 'objectClass',
                    vals: [ 'group', 'top' ]
                }),
            ]
        })).subscribe(x => {
            this.setupRequest = new GroupCreateRequest();
            this.createGroupModal?.close();
            this.onCreate.next();
        })
    }
}