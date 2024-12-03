import { ToastrService } from 'ngx-toastr';

export function getToastrMock(): jasmine.SpyObj<ToastrService> {
  return jasmine.createSpyObj('ToastrService', ['error']);
}
