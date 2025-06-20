import { ModifyDnRequest } from '@models/api/modify-dn/modify-dn';
import { NavigationNode } from '@models/core/navigation/navigation-node';

export interface MoveEntityDialogData {
  toMove: NavigationNode[];
}

export type MoveEntityDialogReturnData = ModifyDnRequest;
