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
    redirectTo: 'entities',
    pathMatch: 'prefix',
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
        '@features/schema-browser/components/schema-navigation/schema-browser-header/schema-browser-header.component'
      ).then((c) => c.SchemaBrowserHeaderComponent),
    outlet: 'header',
  },
];
