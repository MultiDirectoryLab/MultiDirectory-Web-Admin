import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { Subject, takeUntil } from "rxjs";
import { TreeviewComponent } from "multidirectory-ui-kit";


@Component({
    selector: 'app-navigation',
    styleUrls: ['./navigation.component.scss'],
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    @ViewChild('treeView', { static: true } ) treeView?: TreeviewComponent;
    private unsubscribe = new Subject<void>();
    ldapRoots: LdapNode[] = [];
    constructor(
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        this.navigation.ldapRootRx.pipe(takeUntil(this.unsubscribe)).subscribe(roots => {
            this.ldapRoots = roots;
            this.cdr.detectChanges();
        });
        this.navigation.nodeSelected.pipe(takeUntil(this.unsubscribe)).subscribe(node => {
            this.treeView?.selectNode(node.parent);
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    handleNodeSelection(node: LdapNode) {
        this.navigation.setCatalog(node);
    }
}