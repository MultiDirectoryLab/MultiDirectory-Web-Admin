import { Component, Input } from "@angular/core";

@Component({
    selector: 'mf-number',
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.scss']
})
export class NumberComponent {
    @Input() label = '';
    @Input() step = 1;
}