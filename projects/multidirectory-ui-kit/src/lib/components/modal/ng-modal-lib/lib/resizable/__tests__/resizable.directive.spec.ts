import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ResizableDirective } from '../resizable.directive';

@Component({
  template: `<div
    style="width: 100px; height: 100px;"
    [appResizable]="true"
    [south]="true"
    [east]="true"
    [southEast]="true"
  ></div>`,
})
class TestFixtureComponent {}

describe('ResizableDirective', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFixtureComponent, ResizableDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to render span elements', fakeAsync(() => {
    fixture.changeDetectorRef.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      let element = fixture.nativeElement.querySelector('.resize-handle-s');
      expect(element).toBeTruthy();

      element = fixture.nativeElement.querySelector('.resize-handle-e');
      expect(element).toBeTruthy();

      element = fixture.nativeElement.querySelector('.resize-handle-se');
      expect(element).toBeTruthy();
    });
  }));
});
