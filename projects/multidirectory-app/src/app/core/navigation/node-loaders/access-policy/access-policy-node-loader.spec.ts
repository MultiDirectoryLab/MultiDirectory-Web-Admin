import { fakeAsync } from "@angular/core/testing";
import { AccessPolicyNodeLoader } from "./access-policy-node-loader";

describe('AccessPolicyNodeLoaders', () => {
    it('node loader should return fake nodes', fakeAsync( async () => {
        const nodeLoader = new AccessPolicyNodeLoader();
        const root = nodeLoader.get();
        expect(root).toBeDefined();
    }))
})