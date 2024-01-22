import { fakeAsync } from "@angular/core/testing";
import { AccessPolicyNodeLoader } from "./access-policy-node-loader";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";

describe('AccessPolicyNodeLoaders', () => {
    it('node loader should return fake nodes', fakeAsync( async () => {
        const nodeLoader = new AccessPolicyNodeLoader(<MultidirectoryApiService>{});
        const root = nodeLoader.get();
        expect(root).toBeDefined();
    }))
})