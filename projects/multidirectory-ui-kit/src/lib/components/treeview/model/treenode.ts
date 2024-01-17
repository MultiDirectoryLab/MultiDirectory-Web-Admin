import { Observable } from "rxjs";

export class Treenode {    
    id: string = '';
    name?: string;
    selectable = false;
    selected: boolean = false;
    expanded: boolean = false;
    children?: Treenode[];
    childrenLoaded = false;
    parent?: Treenode;
    focused: boolean = false;
    loadChildren?: (() => Observable<Treenode[]>);

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}
