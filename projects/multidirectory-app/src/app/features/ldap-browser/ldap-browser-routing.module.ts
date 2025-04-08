import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ldapBrowserRoutes } from '@features/ldap-browser/ldap-browser.route';

@NgModule({
  imports: [RouterModule.forChild(ldapBrowserRoutes)],
  exports: [RouterModule],
})
export class LdapBrowserRoutingModule {}
