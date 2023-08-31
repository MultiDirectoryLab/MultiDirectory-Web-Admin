import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-user-properties-general',
    styleUrls: [ './user-properties-general.component.scss'],
    templateUrl: './user-properties-general.component.html'
})
export class UserPropertiesGeneralComponent {
    constructor(public toastr: ToastrService) {}
    showOtherSelect() {
        this.toastr.info('IN Progress');
    }
}