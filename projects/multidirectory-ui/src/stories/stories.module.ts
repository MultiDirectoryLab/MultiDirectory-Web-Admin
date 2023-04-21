import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { multidirectoryUiModule } from "../public-api";

@NgModule({
    imports: [ CommonModule, multidirectoryUiModule ]
})
export class StoriesModule {}