export class SearchRequest {
  base_object = '';
  scope = 0;
  deref_aliases = 0;
  size_limit = 0;
  time_limit = 0;
  types_only = false;
  filter = '';
  attributes: string[] = [];
  page_number?: number = undefined;
  constructor(obj: Partial<SearchRequest>) {
    Object.assign(this, obj);
  }
}
