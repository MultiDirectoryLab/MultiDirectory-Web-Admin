import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { DropdownContainerDirective } from './dropdown-container.directive';
import { DropdownMenuComponent } from './dropdown-menu.component';

describe('DropdownContainerDirective', () => {
  let directive: DropdownContainerDirective;
  let mockElementRef: ElementRef;
  let mockDropdownMenu: jasmine.SpyObj<DropdownMenuComponent>;

  beforeEach(() => {
    mockElementRef = new ElementRef(document.createElement('div'));
    mockDropdownMenu = jasmine.createSpyObj('DropdownMenuComponent', [
      'setPosition',
      'setMinWidth',
      'toggle',
      'focus',
    ]);

    TestBed.configureTestingModule({
      providers: [DropdownContainerDirective, { provide: ElementRef, useValue: mockElementRef }],
    });

    directive = TestBed.inject(DropdownContainerDirective);
    directive.mdDropdownContainer = mockDropdownMenu;
    directive.mdDropdownXOffset = 0;
    directive.mdDropdownYOffset = 0;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('onClick', () => {
    it('should toggle the menu if openMenuOnClick is true', () => {
      spyOn(directive, 'toggleMenu');
      directive.openMenuOnClick = true;

      directive.onClick(new Event('click'));

      expect(directive.toggleMenu).toHaveBeenCalled();
    });

    it('should not toggle the menu if openMenuOnClick is false', () => {
      spyOn(directive, 'toggleMenu');
      directive.openMenuOnClick = false;

      directive.onClick(new Event('click'));

      expect(directive.toggleMenu).not.toHaveBeenCalled();
    });

    it('should stop event propagation if openMenuOnClick is true', () => {
      const event = new Event('click');
      spyOn(event, 'stopPropagation');
      directive.openMenuOnClick = true;

      directive.onClick(event);

      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('toggleMenu', () => {
    it('should set the position and toggle the dropdown menu', () => {
      const rect = {
        x: 100,
        y: 200,
        height: 50,
        width: 150,
      };
      spyOn(mockElementRef.nativeElement, 'getBoundingClientRect').and.returnValue(rect);

      directive.mdDropdownXOffset = 10;
      directive.mdDropdownYOffset = 20;

      directive.toggleMenu(true, 300);

      expect(mockDropdownMenu.setPosition).toHaveBeenCalledWith(110, 270); // Adjusted by offsets
      expect(mockDropdownMenu.setMinWidth).toHaveBeenCalledWith(300);
      expect(mockDropdownMenu.toggle).toHaveBeenCalledWith(mockElementRef, true);
    });
  });

  describe('isVisible', () => {
    it('should return the visibility state of the dropdown menu', () => {
      mockDropdownMenu.dropdownVisible = true;
      expect(directive.isVisible()).toBeTrue();

      mockDropdownMenu.dropdownVisible = false;
      expect(directive.isVisible()).toBeFalse();
    });
  });

  describe('focus', () => {
    it('should call the focus method of mdDropdownContainer', () => {
      directive.focus();
      expect(mockDropdownMenu.focus).toHaveBeenCalled();
    });
  });
});
