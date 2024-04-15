import { NgModule } from "@angular/core";
import { HideControlBar } from "./hidecontrolbar.directive";

@NgModule({
    declarations: [
        HideControlBar
    ],
    exports: [
        HideControlBar
    ]
})
export class ModalControlModule {
}
