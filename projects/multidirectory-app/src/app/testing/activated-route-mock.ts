import { ActivatedRoute } from '@angular/router';

export function getActivatedRouteMock() {
  const activatedRouteMock = jasmine.createSpyObj(ActivatedRoute, ['snapshot']);
  activatedRouteMock.snapshot.and.returnValue({ queryParams: {} });
  return activatedRouteMock;
}
