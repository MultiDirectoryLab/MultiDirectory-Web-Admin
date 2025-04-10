import { Routes } from '@angular/router';

export const ldapBrowserRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/ldap-browser/components/catalog-content/catalog-content.component').then(
        (c) => c.CatalogContentComponent,
      ),
  },
  {
    path: ':query',
    loadComponent: () =>
      import('@features/ldap-browser/components/catalog-content/catalog-content.component').then(
        (c) => c.CatalogContentComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import(
        '@features/ldap-browser/components/ldap-browser-header/ldap-browser-header.component'
      ).then((c) => c.LdapBrowserHeaderComponent),
    outlet: 'header',
  },
];
