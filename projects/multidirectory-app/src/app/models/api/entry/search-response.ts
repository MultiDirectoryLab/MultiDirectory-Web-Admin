import { StatusResponse } from './status-response';
import { SearchEntry } from './search-entry';

export interface SearchResponse extends StatusResponse {
  matchedDn: string;
  total_objects: number;
  total_pages: number;
  search_result: SearchEntry[];
}
