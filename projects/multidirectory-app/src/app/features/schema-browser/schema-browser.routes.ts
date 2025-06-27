import { Routes } from '@angular/router';
import { SchemaEntitiesBrowserComponent } from './components/entities-browser/schema-entities-browser.component';
import { ObjectClassBrowserComponent } from './components/object-class-browser/object-class-browser.component';
import { AttributesBrowserComponent } from './components/attributes-browser/attributes-browser.component';

export const schemaBrowserRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '@features/schema-browser/components/schema-navigation/schema-navigation.component'
      ).then((c) => c.SchemaNavigationComponent),
    outlet: 'sidebar',
  },
  {
    path: '',
    loadComponent: () =>
      import('@features/schema-browser/components/schema-browser.component').then(
        (c) => c.SchemaBrowserComponent,
      ),
  },
  {
    path: 'entities',
    component: SchemaEntitiesBrowserComponent,
  },
  {
    path: 'object-classes',
    component: ObjectClassBrowserComponent,
  },
  {
    path: 'attributes',
    component: AttributesBrowserComponent,
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
