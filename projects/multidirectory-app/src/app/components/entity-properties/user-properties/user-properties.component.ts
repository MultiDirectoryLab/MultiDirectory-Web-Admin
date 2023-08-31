import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { ModalService } from "multidirectory-ui-kit";

@Component({
    selector: 'app-user-properties',
    styleUrls: ['./user-properties.component.scss'],
    templateUrl: 'user-properties.component.html'
})
export class UserPropertiesComponent implements OnInit, OnDestroy {
    unsubscribe = new Subject<boolean>();
     
    properties?: any[];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    

    constructor(
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService,
        private modal: ModalService,
        private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onTabChanged(tab: any) {
        this.modal.resize();
        this.cdr.detectChanges();
    }
}