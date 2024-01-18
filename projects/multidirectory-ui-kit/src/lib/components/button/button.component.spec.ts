import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
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
            fixture.detectChanges();
        });
    });

    it('#clicked() should emit', fakeAsync( async () => {
        spyOn(component.click, 'emit');
        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        tick();
        expect(component.click.emit).toHaveBeenCalled();
    }))
})