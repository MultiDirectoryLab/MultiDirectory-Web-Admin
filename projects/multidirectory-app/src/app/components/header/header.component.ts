import { Component, Input, OnDestroy } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject } from "rxjs";
import { LdapNode } from "../../core/ldap/ldap-tree-builder";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    unsubscribe = new Subject<boolean>();
    navigationalPanelInvisible = false;
    @Input() selectedNode?: LdapNode;
    constructor(private app: AppSettingsService) {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onChange(value: boolean) {
        this.navigationalPanelInvisible = value;
        this.app.setNavigationalPanelVisiblity(!this.navigationalPanelInvisible);
        window.dispatchEvent(new Event('resize'));
    }
}