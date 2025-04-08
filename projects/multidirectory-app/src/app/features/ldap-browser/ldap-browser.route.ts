import { Routes } from '@angular/router';
import { CatalogContentComponent } from '@features/ldap-browser/components/catalog-content/catalog-content.component';
import { LdapBrowserHeaderComponent } from '@features/ldap-browser/components/ldap-browser-header/ldap-browser-header.component';

export const ldapBrowserRoute: Routes = [
  { path: '', component: CatalogContentComponent },
  { path: ':query', component: CatalogContentComponent },
  {
    path: '',
    component: LdapBrowserHeaderComponent,
    outlet: 'header',
  },
];
