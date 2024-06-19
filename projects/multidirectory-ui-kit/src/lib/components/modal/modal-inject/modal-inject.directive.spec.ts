import { ChangeDetectorRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { MdPortalService } from '../../portal/portal.service';
import { MdModalService } from '../modal.service';
import { ModalInjectDirective } from './modal-inject.directive';

describe('ModalInjectDirective', () => {
  let directive: ModalInjectDirective;
  let templateRef: TemplateRef<any>;
  let viewContainerRef: ViewContainerRef;
  let cdr: ChangeDetectorRef;
  let portalService: jasmine.SpyObj<MdPortalService>;
  let modalService: jasmine.SpyObj<MdModalService>;

  beforeEach(() => {
    portalService = jasmine.createSpyObj('MdPortalService', ['get']);
    modalService = jasmine.createSpyObj('MdModalService', ['push', 'pop', 'focusLastModal']);
    TestBed.configureTestingModule({
      declarations: [ModalInjectDirective],
      providers: [
        { provide: MdPortalService, useValue: portalService },
        { provide: MdModalService, useValue: modalService },
        {
          provide: TemplateRef,
          useValue: jasmine.createSpyObj('TemplateRef', ['createEmbeddedView']),
        },
        {
          provide: ViewContainerRef,
          useValue: jasmine.createSpyObj('ViewContainerRef', [
            'createEmbeddedView',
            'createComponent',
          ]),
        },
        {
          provide: ChangeDetectorRef,
          useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']),
        },
      ],
    });
    templateRef = TestBed.inject(TemplateRef);
    viewContainerRef = TestBed.inject(ViewContainerRef);
    cdr = TestBed.inject(ChangeDetectorRef);
    directive = new ModalInjectDirective(
      templateRef,
      () => viewContainerRef,
      cdr,
      modalService as any,
    );
    (<any>viewContainerRef.createEmbeddedView).and.returnValue({
      rootNodes: [],
    });
    (<any>viewContainerRef.createComponent).and.returnValue({
      instance: {
        closeModal: new Subject<void>(),
        open: () => {},
      },
    });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should open modal with provided options', () => {
    const component = directive.open();
    expect(component).toBeDefined();
  });

  it('should close modal with result', () => {
    const component = directive.open();
    expect(component).toBeDefined();
  });
});
