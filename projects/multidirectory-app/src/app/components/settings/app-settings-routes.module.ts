import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AccessControlMenuComponent } from "./access-control-menu/access-control-menu.component";
import { MultifactorSettingsComponent } from "./mulifactor-settings/multifactor-settings.component";
import { AuthRouteGuard } from "../../core/authorization/auth-route-guard";

@NgModule({
    imports: [ RouterModule.forChild([
        {
            path: '',
            component: AccessControlMenuComponent,
            canActivate: [ AuthRouteGuard ]
        },
        {
            path: 'multifactor',
            component: MultifactorSettingsComponent,
            canActivate: [ AuthRouteGuard ]
        }
    ])],
    exports: [ RouterModule ]
})
export class AppSettingsRoutingModule {}