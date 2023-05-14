import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";
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

    constructor(private cdr: ChangeDetectorRef) {}

    async toggleNode(node: Treenode) {
        if(!!node.loadChildren && (node.children == null || this.expandStrategy == ExpandStrategy.AlwaysUpdate))
        {
            const childRx = node.loadChildren();
            node.children = !!childRx ? await lastValueFrom(childRx) : null;
        }
        node.expanded = !node.expanded; 
        this.cdr.detectChanges();
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
    expanded: boolean = false;
    children: Treenode[] | null = null;
    loadChildren?: () => Observable<Treenode[]> | null;

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}

