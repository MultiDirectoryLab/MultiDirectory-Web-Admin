import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable, lastValueFrom } from "rxjs";

@Component({
    selector: 'md-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeviewComponent {
    @Input() tree: Treenode[] = [];
    @Input() expandStrategy = ExpandStrategy.AlwaysUpdate;
    @Output() onNodeSelect = new EventEmitter<Treenode>();
    constructor(private cdr: ChangeDetectorRef) {}

    async toggleNode(event: Event, node: Treenode) {
        event.stopPropagation();
        if(!!node.loadChildren && (node.children == null || this.expandStrategy == ExpandStrategy.AlwaysUpdate))
        {
            const childRx = node.loadChildren();
            node.children = !!childRx ? await lastValueFrom(childRx) : null;
        }
        node.expanded = !node.expanded; 
    }
    async handleNodeClick(event: Event, node: Treenode) {
        event.stopPropagation();
        if(node.selectable) {
            this.traverseTree(this.tree, node => { node.selected = false; });
            node.selected = !node.selected;
            if(node.selected) {
                this.onNodeSelect.emit(node);
            }
        }

        await this.toggleNode(event, node);
         
        this.cdr.detectChanges();
    }

    traverseTree(tree: Treenode[], action: (node: Treenode) => void) {
        tree.forEach(node => {
            action(node);
            if(node.children) {
                this.traverseTree(node.children, action);
            }
        });
    }
}

export enum ExpandStrategy {
    None = 0,
    AlwaysUpdate = 1,
    Cache = 2
}

export class Treenode {    
    name?: string;
    icon?: string;
    selectable = false;
    selected: boolean = false;
    expanded: boolean = false;
    children: Treenode[] | null = null;
    loadChildren?: () => Observable<Treenode[]> | null;

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}

