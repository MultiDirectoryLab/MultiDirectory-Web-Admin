import { Page } from "multidirectory-ui-kit";
import { SearchRequest } from "../../models/entry/search-request";
import { LdapEntity } from "./ldap-entity";

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
          "defaultNamingContext",
          "namingContexts",
          "subschemaSubentry",
          "supportedLDAPVersion", 
          "supportedSASLMechanisms",
          "supportedExtension",
          "supportedControl",
          "supportedFeatures",
          "vendorName",
          "vendorVersion",
          "objectClass"
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
          "filter": "(objectClass=*)",
          "attributes": [
            "defaultNamingContext",
            "sAMAccountName",
            "name",
            "objectClass"
          ]
        });
        if(page) {
          req.page_number = page.pageNumber;
        }
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


    findByName(name: string, data?: LdapEntity): SearchRequest {
      return new SearchRequest({
          "base_object": data?.entry?.id ?? '',
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
    },

    findAccessGroups(baseObject: string): SearchRequest {
      return new SearchRequest({
        "base_object": baseObject,
        "scope": 2,
        "deref_aliases": 0,
        "size_limit": 0,
        "time_limit": 0,
        "types_only": false,
        "filter": `(|(objectClass=group))`,
        "attributes": [
          "*"
        ]
      });
    },

    findGroup(name: string, baseDn: string, entityType: string[] = []): SearchRequest {
      return new SearchRequest({
        "base_object": baseDn,
        "scope": 2,
        "deref_aliases": 0,
        "size_limit": 0,
        "time_limit": 0,
        "types_only": false,
        "filter": `(&(objectClass=group)(|(cn=*${name}*)(displayName=*${name}*)))`,
        "attributes": [
          "*"
        ]
      });
    }
};