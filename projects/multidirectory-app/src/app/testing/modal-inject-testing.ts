export class MockModalInjectDirective {
  contentOptions: {
    [value: string]: any;
  } = {};
  constructor(contentOptions: { [value: string]: any }) {}
}

export function getMockModalInjectDirective(contentOptions: {
  [value: string]: any;
}): MockModalInjectDirective {
  return new MockModalInjectDirective(contentOptions);
}
