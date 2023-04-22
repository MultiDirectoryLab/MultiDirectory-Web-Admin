import { ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { MdModalComponent } from "./modal.component";
import { ModalModule } from "ng-modal-full-resizable";
import { ModalTestComponent } from "./modaltest.component";

describe('MdModalComponent', () => {
    let fixture: ComponentFixture<ModalTestComponent>;
    let component: ModalTestComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ModalModule],
            declarations: [ ModalTestComponent, MdModalComponent ]
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
