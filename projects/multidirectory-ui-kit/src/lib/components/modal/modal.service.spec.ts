import { MdModalComponent } from './modal.component';
import { MdModalService } from './modal.service';

describe('Modal Manager Service Test Suite', () => {
  const componentFixture = null;
  let modalManagerService: MdModalService;

  beforeEach(() => {
    modalManagerService = new MdModalService();
  });

  it('Should push a modal', () => {
    const modalMock = jasmine.createSpyObj('modal', ['modal']) as MdModalComponent;
    modalManagerService.push(modalMock);
    const result = modalManagerService.pop()!;
    expect(result).toBeTruthy();
    expect(modalMock).toBe(result);
  });

  it('Should push a modal stack', () => {
    const modalMock1 = jasmine.createSpyObj('modal', ['modal']) as MdModalComponent;
    const modalMock2 = jasmine.createSpyObj('modal', ['modal']) as MdModalComponent;

    modalManagerService.push(modalMock1);
    modalManagerService.push(modalMock2);

    const result1 = modalManagerService.pop()!;
    expect(result1).toBeTruthy();
    expect(modalMock2).toBe(result1);

    const result2 = modalManagerService.pop()!;
    expect(result1).toBeTruthy();
    expect(modalMock1).toBe(result2);
  });
});
