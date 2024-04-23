import { of } from "rxjs";
import { SavedQueriesNodeLoader } from "@core/navigation/node-loaders/saved-query-node-loader/saved-query-node-loader";
import { NavigationNode } from "@core/navigation/navigation-node";

export function getSavedQueriesLoaderMock() {
    // Create jasmine spy object 
    let ldapTreeLoaderSpy = jasmine.createSpyObj(SavedQueriesNodeLoader, ['get']);
    // Provide the dummy/mock data to sortNumberData method.
    ldapTreeLoaderSpy.get.and.returnValue(of([
        new NavigationNode({
            id: 'saved-queries',
            selectable: true,
            route: ['saved-queries'],

        })
    ]));
    return ldapTreeLoaderSpy;
}