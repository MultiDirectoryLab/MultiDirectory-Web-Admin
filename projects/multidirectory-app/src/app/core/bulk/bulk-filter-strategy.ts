export abstract class BulkFilterStrategy<SOURCE> {
  abstract filter(entry: SOURCE): boolean;
}
