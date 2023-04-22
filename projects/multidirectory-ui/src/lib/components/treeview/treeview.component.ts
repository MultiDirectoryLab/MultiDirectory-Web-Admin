import { Component, Input } from "@angular/core";

@Component({
    selector: 'md-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {
    @Input() tree: Treenode[] = [];

    toggleNode(node: Treenode) {
        node.expanded = !node.expanded;
    }
}


interface Treenode {    
    name: string;
    icon: string | null;
    expanded: boolean;
    children: Treenode[] | null;
}