import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import { LdapNode } from "../../../core/ldap/ldap-loader";
import { Subject, takeUntil } from "rxjs";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CreateEntryRequest, LdapPartialAttribute } from "../../../models/entry/create-request";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
 
@Component({
    selector: 'app-ou-create',
    templateUrl: './ou-create.component.html',
    styleUrls: ['./ou-create.component.scss']
})
export class OuCreateComponent implements AfterViewInit, OnDestroy {
    selectedNode?: LdapNode;
    @Output() onCreate = new EventEmitter<void>();
    @ViewChild('createOuModal') createOuModal?: MdModalComponent;
    @ViewChild('form') form!: MdFormComponent;

    private _setupRequest = '';
    @Input() set setupRequest(request: string) {
        this._setupRequest = request;
        this.form?.inputs.forEach(x => x.reset());
    }
    get setupRequest(): string {
        return this._setupRequest;
    }
    unsubscribe = new Subject<void>();
    formValid = false;

    constructor(private navigation: LdapNavigationService, private api: MultidirectoryApiService) {}

    
    ngAfterViewInit(): void {
        this.formValid = this.form.valid;
        this.navigation.nodeSelected.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(node => {
            this.selectedNode = node.parent;
        });

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

    onClose(): void {
        this.setupRequest = '';
        this.createOuModal?.close();
    }
}