import { NavigationNode } from '../navigation/navigation-node';

export interface ContextMenuRequest {
  openX: number;
  openY: number;
  entries: NavigationNode[];
}
