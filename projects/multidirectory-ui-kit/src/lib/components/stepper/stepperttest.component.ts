import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { StepperComponent } from './stepper.component';
import { FirstStepComponent } from './steps/first-step.component';
import { SecondStepComponent } from './steps/second-step.component';
import { ThirdStepComponent } from './steps/third-step.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MultidirectoryUiKitModule } from '../../multidirectory-ui-kit.module';
import { delay, Observable, of, tap } from 'rxjs';

export class TestData {
  firstStep: string = '';
  secondStep: string = '';
  thirdStep: string = '';
}

@Component({
  selector: 'md-stepper-test',
  template: `
    <md-stepper #stepper (finish)="onFinish()">
      <ng-template mdStep>
        <test-first-step [context]="data"></test-first-step>
      </ng-template>
      <test-second-step *mdStep [context]="data"></test-second-step>
      <test-third-step *mdStep [context]="data"></test-third-step>
    </md-stepper>
    <button #nextBtn (click)="stepper.next()">Next</button>
    <div *ngIf="finishedData">
      <div>firstStep: {{ finishedData!.firstStep }}</div>
      <div>secondStep: {{ finishedData!.secondStep }}</div>
      <div>thirdStep: {{ finishedData!.thirdStep }}</div>
    </div>
  `,
})
export class StepperTestComponent {
  @ViewChild('stepper', { static: true }) stepper?: StepperComponent;
  @ViewChild('nextBtn', { static: true }) nextBtn?: ElementRef<HTMLButtonElement>;
  data = new TestData();
  finishedData?: TestData;
  onFinish() {
    this.finishedData = Object.assign({}, this.data);
    this.data = {} as TestData;
    alert('finished');
  }

  firstStepComplete(): Observable<void | null> {
    return of(null).pipe(
      delay(1000),
      tap((x) => {
        alert('step complete');
      }),
    );
  }
}

@NgModule({
  imports: [MultidirectoryUiKitModule, CommonModule, FormsModule],
  declarations: [FirstStepComponent, SecondStepComponent, ThirdStepComponent, StepperTestComponent],
  exports: [StepperTestComponent],
})
export class StepperTestModule {}
