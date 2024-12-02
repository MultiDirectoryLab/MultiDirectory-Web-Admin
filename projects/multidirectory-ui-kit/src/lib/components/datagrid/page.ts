export class Page {
  totalElements: number = 0;
  pageNumber: number = 1;
  size: number = 10;

  get pageOffset(): number {
    return this.pageNumber - 1;
  }
  constructor(obj?: Partial<Page>) {
    Object.assign(this, obj ?? {});
  }
}
