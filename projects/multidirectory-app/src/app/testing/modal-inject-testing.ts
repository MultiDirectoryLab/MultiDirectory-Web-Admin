export class MockModalInjectDirective {
  contentOptions: {
    [value: string]: any;
  } = {};

  open = jasmine.createSpy();

  constructor(contentOptions: { [value: string]: any }) {
    Object.assign(this.contentOptions, contentOptions);
  }
}

export function getMockModalInjectDirective(contentOptions: {
  [value: string]: any;
}): MockModalInjectDirective {
  return new MockModalInjectDirective(contentOptions);
}
