import { Treenode } from "./treenode";

export interface RightClickEvent {
    event: MouseEvent;
    node: Treenode;
}