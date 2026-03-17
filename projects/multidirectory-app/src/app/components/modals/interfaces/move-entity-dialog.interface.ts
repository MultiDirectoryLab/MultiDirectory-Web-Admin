import { NavigationNode } from '@models/core/navigation/navigation-node';
import { ModifyManyDnRequest } from '@models/api/modify-dn/modify-many-dn';

export interface MoveEntityDialogData {
  toMove: NavigationNode[];
}

export type MoveEntityDialogReturnData = ModifyManyDnRequest;
