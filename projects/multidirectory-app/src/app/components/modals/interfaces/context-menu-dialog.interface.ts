import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { ComponentType } from '@angular/cdk/overlay';
import { DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

export interface ContextMenuConfig<R, D, C> {
  component: ComponentType<C>;
  x: number;
  y: number;
  contextMenuConfig?: Partial<DialogConfig<D, DialogRef<R, C>>>;
}

export interface ContextMenuData {
  entity: LdapEntryNode[];
}

export type ContextMenuReturnData<R = undefined> = Observable<R | undefined> | null;
