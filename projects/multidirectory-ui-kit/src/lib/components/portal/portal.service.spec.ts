import { TestBed } from '@angular/core/testing';
import { MdPortalService } from './portal.service';
import { ElementRef, ViewContainerRef } from '@angular/core';

describe('Portal Service Test Suite', () => {
  let service: MdPortalService;
  beforeEach(() => {
    service = new MdPortalService();
  });

  it('Should add a new Portal', () => {
    const obj1 = jasmine.createSpyObj('hostEl', ['nativeElements']) as ViewContainerRef;
    const obj2 = jasmine.createSpyObj('hostEl', ['nativeElements']) as ViewContainerRef;
    const obj3 = jasmine.createSpyObj('hostEl', ['nativeElements']) as ViewContainerRef;

    service.push('test1', obj1);
    service.push('test1', obj2);
    service.push('test2', obj3);

    let result = service.get('test1', 1);
    expect(result).toBe(obj2);
  });

  it('Should delete a new portal', () => {
    const obj1 = jasmine.createSpyObj('hostEl', ['nativeElements']) as ViewContainerRef;
    service.push('test1', obj1);
    service.pop('test1', obj1);
    try {
      service.get('test1');
    } catch (e) {
      expect(e).toBe('Portal not found');
    }
  });
});
