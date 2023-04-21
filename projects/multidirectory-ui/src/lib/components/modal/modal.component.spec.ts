import { ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { MdModalComponent } from "./modal.component";
import { ModalModule } from "ng-modal-full-resizable";
import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    template: `
        <md-modal #modal>
            <ng-container class="app-modal-header">Demo modal</ng-container>
            <ng-container class="app-modal-body">
            <h3>MODAL DIALOG</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
            </ng-container>
            <ng-container class="app-modal-footer">
                <button type="button" #closeButton class="button button3" (click)="modal.close()">Delete</button>
                <button type="button" class="button button1" (click)="modal.close()">Save</button>
                <button type="button" class="button button2" style="float: right;" (click)="modal.close()">Close
            </button>
            </ng-container>
        </md-modal>
        <button #openBtn (click)="modal.open()">Open modal</button>
    `
})
export class ModalTestComponent {
    @ViewChild('modal', { static: true } ) ModalComponent?: MdModalComponent;
    @ViewChild('openBtn', { static: true }) openButton?: ElementRef<HTMLButtonElement>;
    @ViewChild('closeButton', { static: true }) closeButton?: ElementRef<HTMLButtonElement>;
}

describe('MdModalComponent', () => {
    let fixture: ComponentFixture<ModalTestComponent>;
    let component: ModalTestComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ModalModule],
            declarations: [ MdModalComponent, ModalTestComponent ]
        }).compileComponents().then(_ => {
            fixture = TestBed
                .createComponent(ModalTestComponent)
            component = fixture.componentInstance;
        });
    })

    it('should open and close md modal', () => {
        fixture.detectChanges();
        component.openButton!.nativeElement.click();
        fixture.detectChanges();
        expect(component.ModalComponent!.modalRoot!.visible).toBeTrue();
        component.closeButton!.nativeElement.click();
        fixture.detectChanges();
        expect(component.ModalComponent!.modalRoot!.visible).toBeFalse();
    });

    it('should render body', () => {
        fixture.detectChanges();
        component.openButton!.nativeElement.click();
        fixture.detectChanges();
        const bannerElement: HTMLElement = fixture.nativeElement.querySelector('.ui-modal-body');
        expect(bannerElement.innerText).toContain('rem Ipsum is sim');
    })
});