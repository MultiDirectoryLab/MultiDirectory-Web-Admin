import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonComponent } from "./button.component"

describe('ButtonComp', () => {
    let fixture: ComponentFixture<ButtonComponent>;
    let component: ButtonComponent;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ ButtonComponent ],
            providers: []
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ButtonComponent);
            component = fixture.componentInstance;
        });
    });

    it('#clicked() should emit', async () => {
        const clickSpy = spyOn(component, 'click');

        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        fixture.whenStable().then(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    })
})