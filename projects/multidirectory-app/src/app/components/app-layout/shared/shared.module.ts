import { NgModule } from "@angular/core";
import { ContextMenuComponent } from "./contextmenu/contextmenu.component";
import { WindowsComponent } from "./windows/windows.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";
import { EditorsModule } from "../../../features/ldap-browser/components/editors/editors.module";
import { AppFormsModule } from "../../../features/forms/forms.module";
import { PropertiesModule } from "../../../features/ldap-entry-properties/properties.module";

@NgModule({
    declarations: [
        ContextMenuComponent,
        WindowsComponent,
    ],
    exports: [
        ContextMenuComponent,
        WindowsComponent
    ],
    imports: [
        MultidirectoryUiKitModule,
        CommonModule,
        TranslocoModule,
        EditorsModule,
        AppFormsModule,
        PropertiesModule
    ]
})
export class SharedComponentsModule {
}