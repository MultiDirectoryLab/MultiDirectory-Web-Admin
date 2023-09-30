import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { MdFormComponent, MdModalComponent, ModalInjectDirective } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { CreateEntryRequest } from "../../../models/entry/create-request";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { PartialAttribute } from "../../../core/ldap/ldap-partial-attribute";
 
@Component({
    selector: 'app-ou-create',
    templateUrl: './ou-create.component.html',
    styleUrls: ['./ou-create.component.scss']
})
export class OuCreateComponent implements AfterViewInit, OnDestroy {
    selectedNode: LdapEntity | null = null;
    @Output() onCreate = new EventEmitter<void>();
    @ViewChild('form') form!: MdFormComponent;

    _setupRequest = '';
    @Input() set setupRequest(request: string) {
        this._setupRequest = request;
        this.form?.inputs.forEach(x => x.reset());
    }
    get setupRequest(): string {
        return this._setupRequest;
    }
    unsubscribe = new Subject<void>();
    formValid = false;

    constructor(
        private navigation: LdapNavigationService,
        private api: MultidirectoryApiService,
        private modalInejctor: ModalInjectDirective) {}

    
    ngAfterViewInit(): void {
        this.formValid = this.form.valid;
        this.form.onValidChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
        this.selectedNode = this.navigation.selectedCatalog;
    }

    ngOnDestroy(): void {
        this.setupRequest = '';
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onFinish() {
        this.api.create(new CreateEntryRequest({
            entry: `cn=${this.setupRequest},` + this.selectedNode?.id,
            attributes: [new PartialAttribute({
              type: 'objectClass',
              vals: [
              'top', 'container', 'organizationalUnit'
              ]
            }),
          ]
        })).subscribe(x => {
          this.modalInejctor.close(x);
        });
    }

    onClose() {
        this.modalInejctor.close(null);
    }
}