import { PartialAttribute } from "@core/ldap/ldap-partial-attribute";
import { StatusResponse } from "./status-response";

export interface SearchResponse extends StatusResponse {
    matchedDn: string;
    total_objects: number;
    total_pages: number;
    search_result: SearchEntry[];
}

export interface SearchEntry {
    id?: string;
    object_name: string;
    partial_attributes: PartialAttribute[];
}