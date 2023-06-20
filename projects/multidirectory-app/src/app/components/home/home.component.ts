import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { Treenode, TreeviewComponent } from "multidirectory-ui-kit";
import { AppSettingsService } from "../../services/app-settings.service";
import { Subject, takeUntil } from "rxjs";
import { CatalogContentComponent } from "../catalog-content/catalog-content.component";

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
    @ViewChild('treeView') treeView?: TreeviewComponent;
    @ViewChild('catalogContent') catalogContent?: CatalogContentComponent;

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

        this.app.navigationalPanelVisibleRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.showLeftPane = x;
            this.catalogContent?.redraw();
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
    
    changeTreeView(event: LdapNode) {
        if(this.treeView) {
            this.treeView.selectNode(event);
        }
    }
}