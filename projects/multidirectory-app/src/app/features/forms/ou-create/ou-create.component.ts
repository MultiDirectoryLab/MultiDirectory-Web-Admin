import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { MdFormComponent, MdModalComponent, ModalInjectDirective } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";
import { MultidirectoryApiService } from "@services/multidirectory-api.service";
import { CreateEntryRequest } from "@models/entry/create-request";
import { LdapEntryNode } from "@core/ldap/ldap-entity";
import { PartialAttribute } from "@core/ldap/ldap-partial-attribute";
 
@Component({
    selector: 'app-ou-create',
    templateUrl: './ou-create.component.html',
    styleUrls: ['./ou-create.component.scss']
})
export class OuCreateComponent implements AfterViewInit, OnDestroy {
    @Output() onCreate = new EventEmitter<void>();
    @ViewChild('form') form!: MdFormComponent;
    private _unsubscribe = new Subject<void>();
    formValid = false;
    parentDn = '';
    description = ''
    ouName = '';

    constructor(
        private api: MultidirectoryApiService,
        @Inject(ModalInjectDirective) private modalInejctor: ModalInjectDirective) {
        }

    
    ngAfterViewInit(): void {
        this.formValid = this.form.valid;
        this.form.onValidChanges.pipe(
            takeUntil(this._unsubscribe)
        ).subscribe(x => {
            this.formValid = x;
        });
        this.parentDn = this.modalInejctor.contentOptions?.['parentDn'] ?? '';
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    onFinish(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.api.create(new CreateEntryRequest({
            entry: `ou=${this.ouName},` + this.parentDn,
            attributes: [
                new PartialAttribute({
                    type: 'objectClass',
                    vals: [
                    'top', 'container', 'organizationalUnit'
                    ]
                }),
                new PartialAttribute({
                    type: 'description',
                    vals: [
                        this.description
                    ]
                })
            ]
        })).subscribe(x => {
          this.modalInejctor.close(x);
        });
    }

    onClose() {
        this.modalInejctor.close(null);
    }
}