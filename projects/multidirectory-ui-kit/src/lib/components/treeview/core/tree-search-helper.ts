import { Treenode } from '../model/treenode';

export class TreeSearchHelper {
  static traverseTree<NodeType extends Treenode>(
    tree: NodeType[],
    action: (node: NodeType, path: NodeType[]) => void,
    path: NodeType[] = [],
  ) {
    tree.forEach((node) => {
      path.push(node);
      action(node, path);
      if (node.children) {
        TreeSearchHelper.traverseTree<NodeType>(node.children as NodeType[], action, path);
      }
      path.pop();
    });
  }
}
