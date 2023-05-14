import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { Treenode } from "multidirectory-ui-kit";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    tree: Treenode[] = [];

    public user?: WhoamiResponse;
    
    constructor(
        private router: Router, 
        private api: MultidirectoryApiService, 
        private ldapTreeBuilder: LdapTreeBuilder,
        private cdr: ChangeDetectorRef) {
        
        this.api.whoami().subscribe(whoami=> {
            this.user = whoami;
        });

        this.ldapTreeBuilder.getRoot().subscribe(root => {
            this.tree = root;
            this.cdr.detectChanges();
        });
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login'])
    }

}