export interface AttributesSearchResult {
  search_result: {
    object_name: string;
    partial_attributes: {
      type: string;
      vals: string[];
    }[];
  }[];
}
