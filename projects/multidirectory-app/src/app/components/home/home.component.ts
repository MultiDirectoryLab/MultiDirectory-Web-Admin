import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { Treenode } from "multidirectory-ui-kit";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
    tree: Treenode[] = [];
    selectedNode?: LdapNode;
    user?: WhoamiResponse;
    showLeftPane = false;
    unsubscribe = new Subject<boolean>();
    constructor(
        private router: Router, 
        private api: MultidirectoryApiService, 
        private ldapTreeBuilder: LdapTreeBuilder,
        private app: AppSettingsService,
        private cdr: ChangeDetectorRef) {
        
        this.api.whoami().subscribe(whoami=> {
            this.user = whoami;
        });

        this.ldapTreeBuilder.getRoot().subscribe(root => {
            this.tree = root;
            this.cdr.detectChanges();
        });

        this.app.hideNavigationalPanelRx.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            this.showLeftPane = x;
        })
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login'])
    }

    handleNodeSelection(node: LdapNode) {
        this.selectedNode = node;
    }
}