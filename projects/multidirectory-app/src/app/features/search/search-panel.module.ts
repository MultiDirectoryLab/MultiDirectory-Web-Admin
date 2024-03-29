import { NgModule } from "@angular/core";
import { SearchResultComponent } from "./search-forms/search-result/search-result.component";
import { SearchUsersComponent } from "./search-forms/search-users/search-users.component";
import { SearchPanelComponent } from "./search-panel.component";
import { CommonModule } from "@angular/common";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { FormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { SearchSourceProvider } from "./services/search-source-provider";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MultidirectoryUiKitModule,
        TranslocoModule
    ],
    declarations: [
        SearchPanelComponent,
        SearchUsersComponent,
        SearchResultComponent,
    ],
    exports: [
        SearchPanelComponent
    ],
    providers: [
        SearchSourceProvider
    ]
})
export class SearchPanelModule {
}