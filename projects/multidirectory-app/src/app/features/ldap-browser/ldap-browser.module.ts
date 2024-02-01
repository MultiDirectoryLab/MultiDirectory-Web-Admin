import { NgModule } from "@angular/core";
import { CatalogContentComponent } from "./catalog-content/catalog-content.component";
import { TableViewComponent } from "./catalog-content/views/table-view/table-view.component";
import { IconViewComponent } from "./catalog-content/views/icon-view/icon-view.component";
import { GridItemComponent } from "./catalog-content/views/icon-view/grid-item/grid-item.component";
import { EditorsModule } from "./editors/editors.module";
import { LdapBrowserHeaderComponent } from "./ldap-browser-header/ldap-browser-header.component";
import { TranslocoModule } from "@ngneat/transloco";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { CommonModule } from "@angular/common";
import { LdapBrowserRoutingModule } from "./ldap-browser-routing.module";
import { HomeComponent } from "./home/home.component";
import { HotkeyModule } from "angular2-hotkeys";
import { PropertiesModule } from "./entity-properties/properties.module";
import { ValidatorsModule } from "../../core/validators/validators.module";
import { AppFormsModule } from "../forms/forms.module";

@NgModule({
    declarations: [
        CatalogContentComponent,
        TableViewComponent,
        IconViewComponent,
        GridItemComponent,
        LdapBrowserHeaderComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        ValidatorsModule,
        FormsModule,
        TranslocoModule,
        DragDropModule,
        EditorsModule,
        HotkeyModule,
        PropertiesModule,
        LdapBrowserRoutingModule,
        AppFormsModule
    ],
    exports: []
})
export class LdapBrowserModule {
}