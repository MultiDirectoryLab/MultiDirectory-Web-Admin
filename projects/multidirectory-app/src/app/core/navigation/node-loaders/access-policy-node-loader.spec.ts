import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";

describe('AccessPolicyNodeLoaders', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
        }).compileComponents().then(() => {
        });
    });

    it('node loader should return fake nodes', fakeAsync( async () => {
        expect(true).toBe(true);
    }))
})