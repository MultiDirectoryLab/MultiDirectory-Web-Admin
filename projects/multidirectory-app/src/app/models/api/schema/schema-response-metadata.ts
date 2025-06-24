export class SchemaResponseMetadata {
  page_number = 0;
  page_size = 0;
  total_count = 0;
  total_pages = 0;

  constructor(obj: Partial<SchemaResponseMetadata>) {
    Object.assign(this, obj);
  }
}
