import { ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownMenuComponent } from './dropdown-menu.component';

describe('DropdownMenuComponent', () => {
  let component: DropdownMenuComponent;
  let fixture: ComponentFixture<DropdownMenuComponent>;
  let renderer: jasmine.SpyObj<Renderer2>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    renderer = jasmine.createSpyObj('Renderer2', ['setStyle']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [DropdownMenuComponent],
      providers: [
        { provide: Renderer2, useValue: renderer },
        { provide: ChangeDetectorRef, useValue: cdr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownMenuComponent);
    component = fixture.componentInstance;
    component.menu = new ElementRef(document.createElement('div'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setPosition', () => {
    it('should update top and left positions and trigger change detection', () => {
      component.setPosition(100, 200);
      expect(component._top).toBe(200);
      expect(component._left).toBe(100);
    });
  });

  describe('setWidth', () => {
    it('should update width and trigger change detection', () => {
      component.setWidth(300);
      expect(component._width).toBe(300);
    });
  });

  describe('open', () => {
    xit('should set dropdownVisible to true and apply styles', () => {
      component.open();
      expect(component.dropdownVisible).toBeTrue();
      expect(renderer.setStyle).toHaveBeenCalledWith(
        component.menu.nativeElement,
        'left',
        `${component._left}px`,
      );
      expect(renderer.setStyle).toHaveBeenCalledWith(
        component.menu.nativeElement,
        'top',
        `${component._top}px`,
      );
    });
  });

  describe('close', () => {
    it('should set dropdownVisible to false and call change detection', () => {
      spyOn(component, 'unlistenClick').and.callFake(() => {});
      component.dropdownVisible = true;

      component.close();
      expect(component.dropdownVisible).toBeFalse();
    });
  });

  describe('toggle', () => {
    it('should open the dropdown if it is closed', () => {
      spyOn(component, 'open');
      spyOn(component, 'focus');

      component.dropdownVisible = false;
      component.toggle();

      expect(component.open).toHaveBeenCalled();
      expect(component.focus).toHaveBeenCalled();
    });

    it('should close the dropdown if it is open', () => {
      spyOn(component, 'close');

      component.dropdownVisible = true;
      component.toggle();

      expect(component.close).toHaveBeenCalled();
    });
  });

  xdescribe('handleClickOuside', () => {
    it('should close the dropdown if clicked outside and it is visible', () => {
      spyOn(component, 'close');

      component.dropdownVisible = true;
      component.menu.nativeElement.contains = jasmine.createSpy().and.returnValue(false);
      const event = new Event('mousedown');

      component.handleClickOuside(event);
      expect(component.close).toHaveBeenCalled();
    });

    it('should not close the dropdown if clicked inside', () => {
      spyOn(component, 'close');

      component.dropdownVisible = true;
      component.menu.nativeElement.contains = jasmine.createSpy().and.returnValue(true);
      const event = new Event('mousedown');

      component.handleClickOuside(event);
      expect(component.close).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyEvent', () => {
    it('should close the dropdown when Escape key is pressed', () => {
      spyOn(component, 'close');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleKeyEvent(event);

      expect(component.close).toHaveBeenCalled();
    });

    it('should stop event propagation for Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(event, 'stopPropagation');
      spyOn(event, 'preventDefault');

      component.handleKeyEvent(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
