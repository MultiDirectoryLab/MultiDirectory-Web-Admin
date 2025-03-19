import { Injectable } from '@angular/core';
import { LdapTreeService } from './ldap-tree.service';
import { LdapEntry } from '@models/core/ldap/ldap-entry';

@Injectable({
  providedIn: 'root',
})
export class LdapTreeviewService {
  constructor(ldap: LdapTreeService) {}
  expand(dn: string): LdapEntryNode {
    this.ldap.expand(dn);
  }
}
