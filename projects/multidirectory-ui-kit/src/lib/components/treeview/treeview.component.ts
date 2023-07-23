import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
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
            })
            return;
        }
      
        this.onNodeSelect.emit(node);
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
                if(n == node) {
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
    loadChildren?: () => Observable<Treenode[]> | null;

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}

