import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { ModifyDnRequest } from '@models/modify-dn/modify-dn';

export interface MoveEntityDialogData {
  toMove: LdapEntryNode[];
}

export type MoveEntityDialogReturnData = ModifyDnRequest;
