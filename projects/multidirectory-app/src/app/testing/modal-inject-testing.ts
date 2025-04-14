export class MockModalInjectDirective {
  contentOptions: Record<string, any> = {};

  open = jasmine.createSpy();

  constructor(contentOptions: Record<string, any>) {
    Object.assign(this.contentOptions, contentOptions);
  }
}

export function getMockModalInjectDirective(
  contentOptions: Record<string, any>,
): MockModalInjectDirective {
  return new MockModalInjectDirective(contentOptions);
}
