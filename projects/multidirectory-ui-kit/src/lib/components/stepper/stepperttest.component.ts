import { Component, ElementRef, ViewChild } from "@angular/core";
import { StepperComponent } from "./stepper.component";
export class TestData {
    firstStep: string = '';
    secondStep: string = '';
    thridStep: string = '';
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
                    <test-second-step [context]="data"></test-second-step>
                </ng-template>
            </md-stepper>
            <button *ngIf="!finishedData" #nextBtn (click)="stepper.next()">Next</button> 
            <div  *ngIf="finishedData">
                <div>firstStep: {{finishedData.firstStep}}</div>
                <div>secondStep: {{finishedData.secondStep}}</div>
                <div>thirdStep: {{finishedData.thirdStep}}</div>
                <button (click)="stepper.next()">Restart</button> 
            </div>
    `
})
export class StepperTestComponent {
    @ViewChild('stepper', { static: true } ) stepper?: StepperComponent;
    @ViewChild('nextBtn', { static: true }) nextBtn?: ElementRef<HTMLButtonElement>;
    data = new TestData();
    finishedData?: TestData;
    onFinish() {
        this.finishedData = Object.assign({}, this.data);
        this.data = {} as TestData;
    }
}
