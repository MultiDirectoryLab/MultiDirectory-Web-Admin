import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MultifactorSettingsComponent } from "./mulifactor-settings/multifactor-settings.component";
import { AuthRouteGuard } from "../../core/authorization/auth-route-guard";
import { AccessPolicySettingsComponent } from "./access-policy/access-policy-settings.component";
import { MultidirectorySettingsComponent } from "./multidirectory-settings/multidirectory-settings.component";

@NgModule({
    imports: [ RouterModule.forChild([
        {
            path: '',
            component: AccessPolicySettingsComponent,
            canActivate: [ AuthRouteGuard ]
        },
        {
            path: 'multifactor',
            component: MultifactorSettingsComponent,
            canActivate: [ AuthRouteGuard ]
        },
        {
            path: 'multidirectory',
            component: MultidirectorySettingsComponent,
        }
    ])],
    exports: [ RouterModule ]
})
export class AppSettingsRoutingModule {}