import { AfterViewInit, Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-icon-view',
    templateUrl: './icon-view.component.html',
    styleUrls: ['./icon-view.component.scss']
})
export class IconViewComponent implements AfterViewInit {
    constructor(public toast: ToastrService) {}
    ngAfterViewInit(): void {
        this.toast.info('Данный раздел находится в разразботке');
    }
}