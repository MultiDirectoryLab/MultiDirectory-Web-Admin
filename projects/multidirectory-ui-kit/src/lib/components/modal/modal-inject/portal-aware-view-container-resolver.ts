import { InjectionToken, ViewContainerRef } from '@angular/core';

export const PORTAL_AWARE_VIEW_CONTAINER_RESOLVER = new InjectionToken<() => ViewContainerRef>(
  'PORTAL_AWARE_VIEW_CONTAINER_RESOLVER',
);
