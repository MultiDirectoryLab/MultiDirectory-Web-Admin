import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
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