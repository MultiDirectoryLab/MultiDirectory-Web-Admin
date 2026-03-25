export class LdapModificationRecord {
  constructor(
    public operation = 2, // Operation.Replace
    public modification: LdapModification,
  ) {}
}

export interface LdapModification {
  type: string;
  vals: string[];
}

export interface LdapRenameRequest {
  object: string;
  newrdn: string;
  changes: Array<LdapModificationRecord>;
}
