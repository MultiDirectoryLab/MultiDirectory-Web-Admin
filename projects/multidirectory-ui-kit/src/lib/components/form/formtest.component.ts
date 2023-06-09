import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: 'app-formtest',
    template: `
            <md-form>
                <md-textbox required [formControl]="first" mdErrorMessage></md-textbox>
                <md-textbox required [formControl]="second" mdErrorMessage></md-textbox>
                <md-textbox required [formControl]="third" mdErrorMessage></md-textbox>
            </md-form>  
    `
})
export class FormTestComponent {
    first = new FormControl('');
    second = new FormControl('')
    third = new FormControl('');
}
