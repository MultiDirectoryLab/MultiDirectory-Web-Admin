import { Treenode } from '../model/treenode';

export class TreeSearchHelper {
  static findNextSibling(tree: Treenode[], currentNode: Treenode): Treenode | null {
    if (!currentNode?.parent) {
      const foundIndex = tree.findIndex((x) => x.id == currentNode.id);
      if (foundIndex >= 0) {
        return currentNode.children?.[0] ?? null;
      }
      return null;
    }
    const parent = currentNode.parent;
    if (!parent.children) {
      return null;
    }
    const currentIndex = parent.children?.findIndex((x) => x.id == currentNode?.id);
    if (currentIndex + 1 >= parent.children.length) {
      return TreeSearchHelper.findNextSibling(tree, parent);
    }
    return parent.children[currentIndex + 1];
  }

  static findNext(tree: Treenode[], currentNode: Treenode): Treenode | null {
    if (currentNode.expanded && currentNode.children && currentNode.children.length > 0) {
      return currentNode.children[0];
    }
    return TreeSearchHelper.findNextSibling(tree, currentNode);
  }

  static findLastDeepestLeaf(node: Treenode) {
    let child: Treenode = node;
    while (child.children && child.children.length > 0 && child.expanded) {
      child = child.children[child.children.length - 1];
    }
    return child;
  }

  static findPrevious(tree: Treenode[], currentNode: Treenode): Treenode | null {
    const parent = currentNode.parent;
    if (!parent) {
      const currentIndex = tree.findIndex((x) => x.id == currentNode.id);
      if (currentIndex > 0) {
        return tree[currentIndex - 1];
      }
      return this.findLastDeepestLeaf(tree[tree.length - 1]);
    }
    const currentIndex = parent?.children?.findIndex((x) => x.id == currentNode.id);
    if (currentIndex && currentIndex > 0) {
      if (!!parent.children?.[currentIndex - 1]) {
        return this.findLastDeepestLeaf(parent.children?.[currentIndex - 1]);
      }
      return null;
    }

    return parent;
  }

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
