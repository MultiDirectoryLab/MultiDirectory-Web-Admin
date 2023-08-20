import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { Observable, lastValueFrom, of } from "rxjs";

@Component({
    selector: 'md-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeviewComponent implements OnInit {
    @Input() tree: Treenode[] = [];
    @Input() expandStrategy = ExpandStrategy.AlwaysUpdate;
    @Input() nodeLabel: TemplateRef<any> | null = null;
    @ViewChild('defaultLabel', { static: true }) defaultLabel!: TemplateRef<any>;
    @Output() onNodeSelect = new EventEmitter<Treenode>();
    _nodeSelected?: Treenode;

    constructor(private cdr: ChangeDetectorRef) {}
    ngOnInit(): void {
        if(!this.nodeLabel) {
            this.nodeLabel = this.defaultLabel;
        }
    }

    loadChildren(node: Treenode): Observable<Treenode[]> | null {
        if(!!node.loadChildren && (node.children == null || this.expandStrategy == ExpandStrategy.AlwaysUpdate))
        {
            return node.loadChildren ? node.loadChildren() : null;
        }
        return null;
    }

    handleNodeClick(event: Event | null, node: Treenode) {
        if(event) {
            event.stopPropagation();
        }
        
        if(node.expanded && !node.selected) {
            this.traverseTree(this.tree, (node , path)=> { node.selected = false; });
            node.selected = true;
            this.onNodeSelect.emit(node);
            this._nodeSelected = node;
            return;
        }

        if(node.selectable) {
            this.traverseTree(this.tree, (node , path)=> { node.selected = false; });
        }
        
        node.expanded = !node.expanded;
        node.selected = true;
        
        if(node.expanded) {
            this.loadChildren(node)?.subscribe(x => {
                node.children = x;
                node.childrenLoaded = true;
                this.onNodeSelect.emit(node);
                this._nodeSelected = node;
            })
            return;
        }
      
        this.onNodeSelect.emit(node);
        this._nodeSelected = node;
        this.cdr.detectChanges();
    }

    selectNode(node: Treenode) {
            let nodePath: Treenode[] = [];
            let toSelect: Treenode | undefined;
            if(node.selected) {
                return;
            }

            this.traverseTree(this.tree, (n, path) => {
                n.selected = false; 
                if(n.id == node.id) {
                    nodePath = [...path];
                    toSelect = n;
                }
            });
            nodePath.forEach(x => {
                x.expanded = true;
                x.selected = false;
            });
            if(!!toSelect) {
                this.loadChildren(toSelect)?.subscribe(x => {
                    toSelect!.children = x;
                    toSelect!.childrenLoaded = true;
                    toSelect!.selected = true;
                    toSelect!.expanded = true;
                    this.cdr.detectChanges();
                })
            }
            this.cdr.detectChanges();
    }

    traverseTree(tree: Treenode[], action: (node: Treenode, path: Treenode[]) => void, path: Treenode[] = []) {
        tree.forEach(node => {
            path.push(node);
            action(node, path);
            if(node.children) {
                this.traverseTree(node.children, action, path);
            }
            path.pop();
        });
    }

    findNextSibling(currentNode: Treenode): Treenode | undefined {
        if(!currentNode?.parent) {
            const foundIndex = this.tree.findIndex(x => x.id == currentNode.id);
            if(foundIndex >= 0) {
                return currentNode.children?.[0];
            }
            return undefined;
        }
        const parent = currentNode.parent;
        if(!parent.children) {
            return undefined;
        }
        const currentIndex = parent.children?.findIndex(x => x.id ==  currentNode?.id);
        if(currentIndex + 1 >= parent.children.length) {
            return this.findNextSibling(parent);
        }
        return parent.children[currentIndex + 1];
    }

    findNext(currentNode: Treenode): Treenode | undefined {
        if(currentNode.expanded && currentNode.children && currentNode.children.length > 0) {
            return currentNode.children[0];
        }
        return this.findNextSibling(currentNode);
    }

    findPrevious(currentNode: Treenode): Treenode | undefined {
        const parent = currentNode.parent;
        if(!parent) {
            const currentIndex = this.tree.findIndex(x => x.id == currentNode.id);
            if(currentIndex > 0) {
                return this.tree[currentIndex  - 1];
            }
            return undefined;
        }
        const currentIndex = parent?.children?.findIndex(x => x.id == currentNode.id);
        if(currentIndex && currentIndex > 0) {
            return parent.children?.[currentIndex - 1];
        }
        return parent;
    }
    
    @HostListener('keydown', ['$event']) 
    handleKeyEvent(event: KeyboardEvent) {
        console.log(this._nodeSelected);
        if(!this._nodeSelected) {
            this._nodeSelected = this.tree[0];
        }
        if(event.key == 'ArrowDown') {
            const sibling = this.findNext(this._nodeSelected);
            if(sibling) {
                this.handleNodeClick(null, sibling);
            }
        } 
        if(event.key == 'ArrowRight') {
            // expand + child 
            let nextNode = this._nodeSelected.children?.[0];
            if(!nextNode && this._nodeSelected.parent) {
                nextNode = this.findNext(this._nodeSelected);
            }
            if(nextNode) {
                this.handleNodeClick(null, nextNode);
            }
        }
        if(event.key == 'ArrowLeft') {
            // parent + collapse
            let nextNode = this._nodeSelected.parent;
            if(nextNode) {
                this._nodeSelected.expanded = false;
                this.handleNodeClick(null, nextNode);
            }
        }
        if(event.key == 'ArrowUp') {
            // parent 
            let nextNode = this.findPrevious(this._nodeSelected);
            if(nextNode) {
                this.handleNodeClick(null, nextNode);
            }
        }
    }
}

export enum ExpandStrategy {
    None = 0,
    AlwaysUpdate = 1,
    Cache = 2
}

export class Treenode {    
    id: string = '';
    name?: string;
    selectable = false;
    selected: boolean = false;
    expanded: boolean = false;
    children: Treenode[] | null = null;
    childrenLoaded = false;
    parent?: Treenode = undefined;
    loadChildren?: () => Observable<Treenode[]> | null;

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}

