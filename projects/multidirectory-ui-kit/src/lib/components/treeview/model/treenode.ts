import { concat, concatMap, Observable, of, take, tap } from 'rxjs';

export class Treenode {
  id: string = '';
  name: string = '';

  selectable = false;
  selected = false;
  expanded = false;
  expandable = true;
  focused = false;

  children: Treenode[] = [];
  parent?: Treenode;
  loadChildren?: () => Observable<Treenode[]>;

  ensureChildren(): Observable<Treenode> {
    if (this.loadChildren && this.children.length == 0) {
      return this.loadChildren().pipe(
        take(1),
        tap((children) => {
          this.children = children;
        }),
        concatMap((x) => of(this)),
      );
    }
    return of(this);
  }

  constructor(obj: Partial<Treenode>) {
    Object.assign(this, obj);
  }
}
