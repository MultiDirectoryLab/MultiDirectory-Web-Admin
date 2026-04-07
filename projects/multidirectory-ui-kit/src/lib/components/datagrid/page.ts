export class Page {
  totalElements: number = 1;
  size: number = 1;
  pageNumber: number = 1;

  constructor(obj: Partial<Page>) {
    Object.assign(this, obj);
  }
}
