import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { getTranslocoModule } from "@testing/transloco-testing";
import { NavigationComponent } from "./navigation.component";
import { LdapEntryLoader } from "@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";
import { getLdapTreeLoaderMock } from "@testing/ldap-tree-loader-mock";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { Subject, of } from "rxjs";
import { MultidirectoryApiService } from "@services/multidirectory-api.service";
import { getMultidirectoryApiMock } from "@testing/multidirectory-api-mock.service";
import { AccessPolicyNodeLoader } from "@core/navigation/node-loaders/policy-loaders/access-policy-node-loader/access-policy-node-loader";
import { getAccessPolicyNodeLoaderMock } from "@testing/access-policy-node-loader-mock";
import { SavedQueriesNodeLoader } from "@core/navigation/node-loaders/saved-query-node-loader/saved-query-node-loader";
import { getSavedQueriesLoaderMock } from "@testing/saved-queries-node-loader-mock";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";

describe('Navigation Component Test Suit', () => {
    let routerSpy: any;
    let routerEventSubj = new Subject<RouterEvent>();
    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj(Router, ['navigate' ]);
        routerSpy.navigate.and.returnValue(of(new NavigationEnd(0, '/', '/')));
        routerSpy.events = routerEventSubj.asObservable();

        await TestBed.configureTestingModule({
          imports: [
            RouterTestingModule,
            MultidirectoryUiKitModule,
            getTranslocoModule()
          ],
          declarations: [
            NavigationComponent
          ],
          providers: [
            { provide: Router, useValue: routerSpy },
            { provide: LdapEntryLoader, useValue: getLdapTreeLoaderMock() },
            { provide: SavedQueriesNodeLoader, useValue: getSavedQueriesLoaderMock() },
            { provide: AccessPolicyNodeLoader, useValue: getAccessPolicyNodeLoaderMock() },
            { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() }
          ] 
        }).compileComponents();
      });
    
      it('should create the component', () => {
        const fixture = TestBed.createComponent(NavigationComponent);
        const navigation = fixture.componentInstance;
        expect(navigation).toBeTruthy();
        fixture.detectChanges();
        expect(navigation.navigationTree).toBeDefined();
        expect(navigation.navigationTree.length).toBeGreaterThan(0);
      });

      it('should toggle node on click', fakeAsync(async () => {
        const fixture = TestBed.createComponent(NavigationComponent);
        const navigation = fixture.componentInstance;
        fixture.detectChanges();
        tick();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.outerHTML).toContain('tree-label');
            const testNode1 = navigation.navigationTree[1].data;
            let treeNode = fixture.debugElement.nativeElement.querySelector('.tree-item-wrapper[data-id=' + testNode1.id + ']');
            expect(testNode1.selectable).toBeTrue();
            expect(testNode1.selected).toBeFalse();
            treeNode.click();
            tick();
            fixture.detectChanges();
            expect(testNode1.selected).toBeTrue();
        })
      }));

      it('should highlight node on route change', fakeAsync(async () => {
        const fixture = TestBed.createComponent(NavigationComponent);
        const navigation = fixture.componentInstance;
        fixture.detectChanges();
        tick();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const testNode1 = navigation.navigationTree[2];
            const testNode2 = navigation.navigationTree[1];
            expect(testNode1.route![0]).toContain('/');
            expect(testNode1.selected).toBeFalse();
            expect(testNode2.route![0]).toContain('saved-queries');
            expect(testNode2.selected).toBeFalse();
            
            routerEventSubj.next(new NavigationEnd(1, '/', '/'));
            expect(testNode1.selected).toBeTrue();
            expect(testNode2.selected).toBeFalse();

            routerEventSubj.next(new NavigationEnd(1, '/saved-queries', '/saved-queries'));
            expect(testNode1.selected).toBeFalse();
            expect(testNode2.selected).toBeTrue();
        })
      }))
})