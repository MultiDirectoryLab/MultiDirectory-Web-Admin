export class EntityAttribute {
  constructor(
    public name: string,
    public val: string,
    public changed = false,
    public writable = true,
  ) {}
}
