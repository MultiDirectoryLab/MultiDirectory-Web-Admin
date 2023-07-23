import { Page } from "multidirectory-ui-kit";
import { SearchRequest } from "../../models/entry/search-request";
import { LdapNode } from "./ldap-loader";

export const SearchQueries = {
  RootDse: {
        "base_object": "",
        "scope": 0,
        "deref_aliases": 0,
        "size_limit": 0,
        "time_limit": 0,
        "types_only": false,
        "filter": "(objectClass=*)",
        "attributes": [
          "defaultNamingContext"
        ]
    },
  
    getChild(baseObject: string): SearchRequest {
      return new SearchRequest({
          "base_object": baseObject,
          "scope": 1,
          "deref_aliases": 0,
          "size_limit": 0,
          "time_limit": 0,
          "types_only": false,
          "filter": "(|(objectClass=builtinDomain)(objectClass=container))",
          "attributes": [
            "defaultNamingContext",
            "sAMAccountName",
            "name",
            "objectClass"
          ]
        });
    },

    getContent(baseObject: string, page?: Page): SearchRequest {
      const req = new SearchRequest({
          "base_object": baseObject,
          "scope": 1,
          "deref_aliases": 0,
          "size_limit": page?.size ?? 0,
          "time_limit": 0,
          "types_only": false,
          "page_number": page?.pageNumber ?? 1,
          "filter": "(objectClass=*)",
          "attributes": [
            "defaultNamingContext",
            "sAMAccountName",
            "name",
            "objectClass"
          ]
        });
        return req;
    },


    getProperites(baseObject: string): SearchRequest {
      return new SearchRequest({
          "base_object": baseObject,
          "scope": 0,
          "deref_aliases": 0,
          "size_limit": 0,
          "time_limit": 0,
          "types_only": false,
          "filter": "(objectClass=*)",
          "attributes": [
            "*"
          ]
        });
    },


    findByName(name: string, data: LdapNode): SearchRequest {
      return new SearchRequest({
          "base_object": data.entry?.id,
          "scope": 2,
          "deref_aliases": 0,
          "size_limit": 0,
          "time_limit": 0,
          "types_only": false,
          "filter": `(|(cn=*${name}*)(displayName=*${name}*))`,
          "attributes": [
            "*"
          ]
        });
    }
};