export class ModifyManyDnRequest {
  constructor(public entry: ModifyDnRequest[] = []) {}
}

export interface ModifyDnRequest {
  entry: string;
  newrdn: string;
  deleteoldrdn: boolean;
  new_superior: string;
}
