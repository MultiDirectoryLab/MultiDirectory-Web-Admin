import { Page } from "multidirectory-ui-kit";
import { SearchRequest } from "../../models/entry/search-request";

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

    getContent(baseObject: string, page: Page): SearchRequest {
      return new SearchRequest({
          "base_object": baseObject,
          "scope": 1,
          "deref_aliases": 0,
          "size_limit": 0,
          "time_limit": 0,
          "types_only": false,
          "filter": "(objectClass=*)",
          "attributes": [
            "defaultNamingContext",
            "sAMAccountName",
            "name",
            "objectClass"
          ]
        });
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


    findByName(name: string): SearchRequest {
      return new SearchRequest({
          "base_object": '',
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