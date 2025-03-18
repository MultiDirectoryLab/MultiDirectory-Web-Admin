export interface AttributesSearchResult {
  search_result: Array<{
    object_name: string;
    partial_attributes: Array<{
      type: string;
      vals: string[];
    }>;
  }>;
}
