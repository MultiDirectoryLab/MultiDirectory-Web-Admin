export class DeleteEntryRequest {
  entry = '';

  constructor(obj: Partial<DeleteEntryRequest>) {
    Object.assign(this, obj);
  }
}
