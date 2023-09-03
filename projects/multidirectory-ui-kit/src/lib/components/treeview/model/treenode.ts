import { Observable } from "rxjs";

export class Treenode {    
    id: string = '';
    name?: string;
    selectable = false;
    selected: boolean = false;
    expanded: boolean = false;
    children: Treenode[] | null = null;
    childrenLoaded = false;
    parent: Treenode | null = null;
    focused: boolean = false;
    loadChildren: (() => Observable<Treenode[]>) | null = null;

    constructor(obj: Partial<Treenode>) {
        Object.assign(this, obj);
    }
}
