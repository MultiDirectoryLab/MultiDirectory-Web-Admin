import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LdapBrowserHeaderComponent } from './components/ldap-browser-header/ldap-browser-header.component';
import { CatalogContentComponent } from './components/catalog-content/catalog-content.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: CatalogContentComponent },
      { path: ':query', component: CatalogContentComponent },
      {
        path: '',
        component: LdapBrowserHeaderComponent,
        outlet: 'header',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class LdapBrowserRoutingModule {}
