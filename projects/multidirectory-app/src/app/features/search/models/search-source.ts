import { SearchType } from "./search-type";

export class SearchSource {
    title: string = '';
    type: SearchType = SearchType.None;
    data: any;

    constructor(obj: Partial<SearchSource>) {
        Object.assign(this, obj);
    }
}