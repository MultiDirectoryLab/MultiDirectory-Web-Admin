import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { StepperComponent } from './stepper.component';
import { FirstStepComponent } from './steps/first-step.component';
import { SecondStepComponent } from './steps/second-step.component';
import { ThirdStepComponent } from './steps/third-step.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MultidirectoryUiKitModule } from '../../multidirectory-ui-kit.module';

export class TestData {
  firstStep: string = '';
  secondStep: string = '';
  thirdStep: string = '';
}

@Component({
  selector: 'md-stepper-test',
  template: `
    <md-stepper #stepper (onFinish)="onFinish()">
      <ng-template mdStep>
        <test-first-step [context]="data"></test-first-step>
      </ng-template>
      <ng-template mdStep>
        <test-second-step [context]="data"></test-second-step>
      </ng-template>
      <ng-template mdStep>
        <test-third-step [context]="data"></test-third-step>
      </ng-template>
    </md-stepper>
    <button *ngIf="!finishedData" #nextBtn (click)="stepper.next()">Next</button>
    <div *ngIf="finishedData">
      <div>firstStep: {{ finishedData!.firstStep }}</div>
      <div>secondStep: {{ finishedData!.secondStep }}</div>
      <div>thirdStep: {{ finishedData!.thirdStep }}</div>
      <button (click)="stepper.next()">Restart</button>
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
  }
}

@NgModule({
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    FormsModule,
    FirstStepComponent,
    SecondStepComponent,
    ThirdStepComponent,
    StepperTestComponent,
  ],
  exports: [StepperTestComponent],
})
export class StepperTestModule {}
