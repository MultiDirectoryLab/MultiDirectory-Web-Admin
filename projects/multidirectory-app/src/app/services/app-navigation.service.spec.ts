import { of, take } from "rxjs";
import { NavigationNode } from "../core/navigation/navigation-node";
import { AppNavigationService } from "./app-navigation.service";
import { TestBed } from "@angular/core/testing";
import { LdapTreeLoader } from "../core/navigation/node-loaders/ldap-tree-loader/ldap-tree-loader";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { getLdapTreeLoaderMock } from "../testing/ldap-tree-loader-mock";

describe('NavigationServiceSuite', () => {
    let naviagtionService: AppNavigationService;
    let fixture;
    
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [],    
            providers: [
                { provide: LdapTreeLoader, useValue: getLdapTreeLoaderMock()},
                { provide: AppNavigationService, useClass: AppNavigationService }
            ]
         }).compileComponents();
      });
   
    beforeEach( () => {
        naviagtionService = TestBed.inject(AppNavigationService);
    });

    it('NavigationService should return root', () => {
        expect(naviagtionService.buildNavigationRoot()).toBeTruthy();
    })

    it('Navigationservice should return first level consists of different types of nodes', () => {
        naviagtionService.buildNavigationRoot().pipe(take(1)).subscribe(tree => {    
            expect(tree[0]).toBeInstanceOf(NavigationNode);
            expect(tree[0].id).toEqual('accessPolicy');
            expect(tree[0].loadChildren).toBeTruthy();

            expect(tree[1]).toBeInstanceOf(NavigationNode);
            expect(tree[1].id).toEqual('savedQueries');

            expect(tree[2]).toBeInstanceOf(LdapEntity);
            expect(tree[2].id).toEqual('ldap-root');
        });
    })
});