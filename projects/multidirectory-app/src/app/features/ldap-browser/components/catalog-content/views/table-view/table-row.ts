import { NavigationNode } from '@models/core/navigation/navigation-node';

export interface TableRow {
  icon: string;
  name: string;
  type: string;
  description: string;
  entry: NavigationNode;
}
