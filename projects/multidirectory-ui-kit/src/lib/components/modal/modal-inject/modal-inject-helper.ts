function findModalParts(nodes: HTMLElement[]) {
  const header = nodes.filter((x) => x?.classList?.contains('app-modal-header') ?? false);
  const footer = nodes.filter((x) => x?.classList?.contains('app-modal-footer') ?? false);
  const body = nodes.filter(
    (x) =>
      !x?.classList?.contains('app-modal-footer') && !x?.classList?.contains('app-modal-header'),
  );
  return [header, body, footer];
}

export function getModalParts(rootNodes: any[]) {
  let nodes = findModalParts(rootNodes);
  if (nodes.some((x) => !x || x.length == 0)) {
    const childNodes = findModalParts(Array.from(rootNodes.flatMap((x) => Array.from(x.children))));
    let inChildFound = false;
    if (nodes[0].length == 0 && childNodes[0].length > 0) {
      nodes[0] = childNodes[0];
      inChildFound = true;
    }
    if (nodes[2].length == 0 && childNodes[2].length > 0) {
      nodes[2] = childNodes[2];
      inChildFound = true;
    }
    if (childNodes[1].length > 0 && inChildFound) nodes[1] = childNodes[1];
  }
  return nodes;
}
