import { Observable } from "rxjs";
import { NavigationNode } from "../navigation-node";

export interface NodeLoader {
    get(): Observable<NavigationNode[]>;
}