import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { Page, TreeviewComponent } from "multidirectory-ui-kit";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";

@Component({
    selector: 'app-navigation',
    styleUrls: ['./navigation.component.scss'],
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    @ViewChild('treeView', { static: true } ) treeView?: TreeviewComponent;
    private unsubscribe = new Subject<void>();
    ldapRoots: LdapEntity[] = [];
    constructor(
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        this.navigation.ldapRootRx.pipe(takeUntil(this.unsubscribe)).subscribe(roots => {
            this.ldapRoots = roots;
            this.cdr.detectChanges();
        });
        this.navigation.selectedCatalogRx.pipe(takeUntil(this.unsubscribe)).subscribe(catalog => {
            this.treeView?.selectNode(catalog);
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    handleNodeSelection(node: LdapEntity) {
        const page = new Page(Object.assign({}, this.navigation.page));
        page.pageNumber = 1;
        this.navigation.setCatalog(node, page);
    }
}