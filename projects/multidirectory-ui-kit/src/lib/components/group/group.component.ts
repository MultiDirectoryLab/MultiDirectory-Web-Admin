import { Component, Input } from "@angular/core";

@Component({
    selector: 'md-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent {
    @Input() title = ''
}