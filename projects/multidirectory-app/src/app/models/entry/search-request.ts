export class SearchRequest {
  base_object: string = '';
  scope: number = 0;
  deref_aliases: number = 0;
  size_limit: number = 0;
  time_limit: number = 0;
  types_only: boolean = false;
  filter: string = '';
  attributes: string[] = [];

  constructor(obj: Partial<SearchRequest>) {
    Object.assign(this, obj);
  }
}
  