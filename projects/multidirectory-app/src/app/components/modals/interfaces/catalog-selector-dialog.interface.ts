import { NavigationNode } from '@models/core/navigation/navigation-node';

export interface CatalogSelectorDialogData {
  ldapTree: NavigationNode[];
}

export type CatalogSelectorDialogReturnData = NavigationNode[];
