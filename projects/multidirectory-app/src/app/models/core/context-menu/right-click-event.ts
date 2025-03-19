import { NavigationNode } from '../navigation/navigation-node';

export interface RightClickEvent {
  selected: NavigationNode[];
  pointerEvent: PointerEvent;
}
