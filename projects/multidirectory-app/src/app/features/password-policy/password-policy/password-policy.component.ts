import { Component, ViewChild } from "@angular/core";
import { MdFormComponent } from "multidirectory-ui-kit";
import { PasswordPolicy } from "../../../core/password-policy/password-policy";

@Component({
    selector: 'app-password-policy',
    templateUrl: './password-policy.component.html',
    styleUrls: ['./password-policy.component.scss'],
}) 
export class PasswordPolicyComponent  {
    @ViewChild('form') form!: MdFormComponent;
    passwordPolicy = new PasswordPolicy();
    constructor() {}
    close() {
    }
    
    save() {
        this.form.validate();
    }
}