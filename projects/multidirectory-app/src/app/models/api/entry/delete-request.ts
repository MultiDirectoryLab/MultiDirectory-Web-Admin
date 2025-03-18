export class DeleteEntryRequest {
  entry: string = '';

  constructor(obj: Partial<DeleteEntryRequest>) {
    Object.assign(this, obj);
  }
}
