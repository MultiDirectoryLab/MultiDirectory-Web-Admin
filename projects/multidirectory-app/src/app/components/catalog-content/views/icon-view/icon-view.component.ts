import { AfterViewInit, Component, forwardRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BaseViewComponent } from "../base-view.component";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";

@Component({
    selector: 'app-icon-view',
    templateUrl: './icon-view.component.html',
    styleUrls: ['./icon-view.component.scss'],
    providers: [
        { provide: BaseViewComponent, useExisting: forwardRef(() => IconViewComponent) }
    ]
})
export class IconViewComponent extends BaseViewComponent implements AfterViewInit {
    items: LdapNode[] = [];
    constructor(public toast: ToastrService) {
        super()
    }
    ngAfterViewInit(): void {
        this.toast.info('Данный раздел находится в разразботке');
    }

    override setContent(items: LdapNode[], selectedNodes: LdapNode[]): void {
        this.items = items;
    }
    override getSelected(): LdapNode[] {
        return [];
    }
    override setSelected(selected: LdapNode[]): void {
    }
}