import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { Observable, Subject, lastValueFrom, of } from "rxjs";
import { Treenode } from "./model/treenode";
import { TreeSearchHelper } from "./core/tree-search-helper";
import { ExpandStrategy } from "./model/expand-strategy";

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
    _nodeSelected: Treenode | null = null;
    _nodeFocused: Treenode | null = null;

    constructor(private cdr: ChangeDetectorRef) {}
    ngOnInit(): void {
        if(!this.nodeLabel) {
            this.nodeLabel = this.defaultLabel;
        }
    }

    loadChildren(node: Treenode): Observable<Treenode[]> {
        if(!!node.loadChildren && (node.children == null || this.expandStrategy == ExpandStrategy.AlwaysUpdate))
        {
            return node.loadChildren ? node.loadChildren() : of([]);
        }
        return of(node.children ?? []);
    }

    // Расширить этот узел
    expand(node: Treenode, state: boolean = true): Observable<Treenode[]> {
        node.expanded = state;
        if(node.expanded) {
            return this.loadChildren(node);
        }
        return of(node.children ?? []);
    }

    // Выбрать этот узел
    select(node: Treenode) {
        this.focus(null);
        if(node.selectable) {
            TreeSearchHelper.traverseTree(this.tree, (node , path)=> { node.selected = false; });
            node.selected = true;
            this._nodeSelected = node;
            this.onNodeSelect.emit(node);
            this.cdr.detectChanges();
        }
    }

    focus(node: Treenode | null = null) {
        TreeSearchHelper.traverseTree(this.tree, (node, path) => {node.focused = false}, []);
        this._nodeFocused = null;
        if(node) {
            node.focused = true;
            this._nodeFocused = node;
        }
    }

    handleNodeClick(event: Event | null, node: Treenode) {
        if(event) {
            event.stopPropagation();
        }
        if(!node.selected && node.selectable && node.expanded) {
            this.select(node);
            return;
        }
        this.expand(node, !node.expanded).subscribe(x => {
            node.children = x;
            node.childrenLoaded = true;
            if(node.selectable) {
                this.select(node);
            }
            this.cdr.detectChanges();
        });
    
    }

    selectNode(node: Treenode | null) {
            let nodePath: Treenode[] = [];
            let toSelect: Treenode | undefined;

            if(!node) {
                TreeSearchHelper.traverseTree(this.tree, (n, path) => {
                    n.selected = false; 
                });
                this.cdr.detectChanges();
                return;
            }
            
            if(node.selected) {
                return;
            }

            TreeSearchHelper.traverseTree(this.tree, (n, path) => {
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

    @HostListener('keydown', ['$event']) 
    handleKeyEvent(event: KeyboardEvent) {
        if(!this._nodeFocused) {
            this._nodeFocused =  this._nodeSelected ?? this.tree[0];
        }
        if(event.key == 'ArrowUp') {
            // parent 
            let nextNode = TreeSearchHelper.findPrevious(this.tree, this._nodeFocused);
            this.focus(nextNode);
        }
        if(event.key == 'ArrowDown') {
            const sibling = TreeSearchHelper.findNext(this.tree, this._nodeFocused);
            if(sibling) {
                this.focus(sibling);
            }
        } 
        if(event.key == 'ArrowRight' || event.key == 'Enter') {
            // expand + child 
            let nextNode = this._nodeFocused ?? null;
            if(nextNode) {
                this.handleNodeClick(null, nextNode);
            }
        }
        if(event.key == 'ArrowLeft') {
            // parent + collapse
            let nextNode = this._nodeFocused;
            if(nextNode?.parent && nextNode?.parent?.id !== 'root') {
                nextNode.expanded = false;
                this.cdr.detectChanges();
            }
        }
    }
}
