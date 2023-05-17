import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PlaneButtonComponent } from "./plane-button.component";

describe('ButtonComp', () => {
    let fixture: ComponentFixture<PlaneButtonComponent>;
    let component: PlaneButtonComponent;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ PlaneButtonComponent ],
            providers: []
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PlaneButtonComponent);
            component = fixture.componentInstance;
        });
    });

    it('#clicked() should emit', async () => {
        const clickSpy = spyOn(component, 'emitClick');

        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        fixture.whenStable().then(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    })
})