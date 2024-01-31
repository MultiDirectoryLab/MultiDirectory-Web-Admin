import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LdapBrowserHeaderComponent } from "./ldap-browser-header/ldap-browser-header.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HomeComponent },
            { path: ':query', component: HomeComponent},
            { 
                path: '',
                component: LdapBrowserHeaderComponent,
                outlet: 'header'
            }
        ]) 
    ],
    exports: [ RouterModule ]
})
export class LdapBrowserRoutingModule {
}