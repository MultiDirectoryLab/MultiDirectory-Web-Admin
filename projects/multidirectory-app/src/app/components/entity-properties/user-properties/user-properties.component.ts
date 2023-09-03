import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject, take } from "rxjs";
import { ModalService } from "multidirectory-ui-kit";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { LdapEntityAccessor } from "../../../core/ldap/ldap-entity-accessor";

@Component({
    selector: 'app-user-properties',
    styleUrls: ['./user-properties.component.scss'],
    templateUrl: 'user-properties.component.html'
})
export class UserPropertiesComponent implements OnInit, OnDestroy {
    unsubscribe = new Subject<boolean>();
    accessor: LdapEntityAccessor | null = null;
    properties?: any[];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    
    
    constructor(
        private modal: ModalService,
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        this.navigation.getEntityAccessor().pipe(take(1)).subscribe((accessor) => {
            this.accessor = accessor;
            this.cdr.detectChanges();
            this.modal.resize();
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onTabChanged() {
        this.modal.resize();
        this.cdr.detectChanges();
    }
}