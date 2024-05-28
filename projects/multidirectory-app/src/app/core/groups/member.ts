export class Member {
  dn?: string;
  path?: string;
  name?: string;

  constructor(obj: Partial<Member>) {
    Object.assign(this, obj);
  }
}
