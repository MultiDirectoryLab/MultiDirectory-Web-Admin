import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { Observable, lastValueFrom } from "rxjs";

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

    async loadChildren(node: Treenode) {
        if(!!node.loadChildren && (node.children == null || this.expandStrategy == ExpandStrategy.AlwaysUpdate))
        {
            const childRx = node.loadChildren();
            node.children = !!childRx ? await lastValueFrom(childRx) : null;
        }
    }

    async toggleNode(event: Event | null, node: Treenode) {
        if(event) {
            event.stopPropagation();
        }
        await this.loadChildren(node);
        node.expanded = !node.expanded; 
    }

    async handleNodeClick(event: Event | null, node: Treenode) {
        if(event) {
            event.stopPropagation();
        }
        if(node.selectable) {
            this.traverseTree(this.tree, (node , path)=> { node.selected = false; });
            node.selected = !node.selected;
            if(node.selected) {
                this.onNodeSelect.emit(node);
            }
        }

        await this.toggleNode(event, node);
        this.cdr.detectChanges();
    }

    selectNode(node: Treenode) {
        setTimeout(async () => {
            let nodePath: Treenode[] = [];
            let toSelect: Treenode | undefined;
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
                await this.loadChildren(toSelect);
                toSelect.selected = true;
                toSelect.expanded = true;
            }
            this.cdr.detectChanges();
        });
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
    loadChildren?: () => Observable<Treenode[]> | null;

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}

