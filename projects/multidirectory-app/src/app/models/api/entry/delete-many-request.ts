export type TSelectedItems = Array<{ entry: string }>;
export class DeleteManyEntryRequest {
  selectedItems: TSelectedItems = [];

  constructor(obj: Partial<DeleteManyEntryRequest>) {
    Object.assign(this, obj);
  }
}
