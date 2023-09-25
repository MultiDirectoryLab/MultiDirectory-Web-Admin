import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { MdModalComponent, TreeviewComponent } from "multidirectory-ui-kit";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { Observable, Subject, takeUntil } from "rxjs";
import { LdapEntity } from "../../../core/ldap/ldap-entity";

@Component({
    selector: 'app-catalog-selector',
    templateUrl: './catalog-selector.component.html',
    styleUrls: [ './catalog-selector.component.scss' ]
})
export class CatalogSelectorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('modal', {static: true}) modal?: MdModalComponent;
    @ViewChild('ldapTree', {static: true}) treeView?: TreeviewComponent;
    private unsubscribe = new Subject<void>();
    private _result = new Subject<LdapEntity | null>();
    private _selectedNode?: LdapEntity;
    ldapRoots: LdapEntity[] = [];


    constructor(private navigation: LdapNavigationService, private cdr: ChangeDetectorRef) {}
    ngAfterViewInit(): void {
        this.treeView?.onNodeSelect.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            this._selectedNode = <LdapEntity>x;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    
    open(): Observable<LdapEntity | null> {
        this.navigation.ldapRootRx.pipe(takeUntil(this.unsubscribe)).subscribe(roots => {
            this.ldapRoots = roots;
            this.cdr.detectChanges();
        });
        this.modal?.open();
        return this._result.asObservable();
    }

    close() {
        this.modal?.close();
        this._result.next(null);
    }

    finish() {
        this.modal?.close();
        this._result.next(this._selectedNode ?? null);
    }

}