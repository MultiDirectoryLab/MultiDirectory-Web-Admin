import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import BitSet from "bitset";
import { ModalInjectDirective } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { UserAccountControlFlag } from "projects/multidirectory-app/src/app/core/ldap/user-account-control-flags";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { take, tap } from "rxjs";

@Component({
    selector: 'app-user-properties-account',
    templateUrl: './user-properties-account.component.html',
    styleUrls: ['./user-properties-account.component.scss']
})
export class UserPropertiesAccountComponent implements AfterViewInit {
    UserAccountControlFlag = UserAccountControlFlag;

    accessor!: LdapAttributes;
    uacBitSet?: BitSet;

    get userShouldChangePassword(): boolean {
        return this.accessor?.['pwdLastSet']?.[0] === '0';
    }
    set userShouldChangePassword(shouldChange: boolean) {
        if(shouldChange) {
            if(!!this.accessor?.['pwdLastSet']?.[0]) {
                this.accessor['pwdLastSet'][0] = '0';
            } else {
                this.accessor['pwdLastSet'] = ['0'];
            }
            return;
        }
        this.accessor['pwdLastSet'] = [ Date.now().toString() ];
    }

    constructor(private navigation: LdapNavigationService, private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.navigation.entityAccessorRx().pipe(
            tap(accessor => { 
                if(!accessor) {
                    return
                }
                this.accessor = accessor;
                const uacBits = accessor['userAccountControl']?.[0];
                this.uacBitSet = !!accessor['userAccountControl']
                    ? BitSet.fromHexString(Number(uacBits).toString(16)) 
                    : new BitSet();

                this._accountExpires = !!this.accessor?.['accountExpires']?.[0];
                this._expireDate = this.accessor['accountExpires']?.[0] ?? '';
            }),
        ).subscribe(() => {
            this.cdr.detectChanges();
        });
    }

    @ViewChild('editLogonTime') editLogonTime!: ModalInjectDirective;
    showLogonTimeEditor() {
        this.editLogonTime.open({ 'width': '732px' }, { 'logonHours': this.accessor!.logonHours }).pipe(
            take(1)
        ).subscribe((result: string | null) => {
            if(!this.accessor || !result) 
                return;

            this.accessor.logonHours = [result];
        });
    }

    get passwordNeverExpires(): boolean {
        return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.DONT_EXPIRE_PASSWORD) > 0
            ? true 
            : false;
    }
    set passwordNeverExpires(value: boolean) {
        this.uacBitSet?.set(Math.log2(UserAccountControlFlag.DONT_EXPIRE_PASSWORD), value ? 1 : 0);
        this.accessor['userAccountControl'] = [ this.uacBitSet?.toString(10) ];
    }

    get storePasswordReversible(): boolean {
        return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT) > 0
            ? true 
            : false;
    }
    set storePasswordReversible(value: boolean) {
        this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT), value ? 1 : 0);
        this.accessor['userAccountControl'] = [ this.uacBitSet?.toString(10) ];
    }

    get accountDisabled(): boolean {
        return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) > 0
            ? true 
            : false;
    }
    set accountDisabled(value: boolean) {
        this.uacBitSet?.set(Math.log2(UserAccountControlFlag.ACCOUNTDISABLE), value ? 1 : 0);
        this.accessor['userAccountControl'] = [ this.uacBitSet?.toString(10) ];
    }

    _expireDate = Date.now().toString();
    _accountExpires = false;
    set accountExpires(value: boolean) {
        this._accountExpires = value;
        if(this.accessor?.['accountExpires']) {
            this.accessor['accountExpires'] = [ !value ? '' : this.expireDate ]
        }
    }
    get accountExpires(): boolean {
        return this._accountExpires;
    }
    set expireDate(value: string) {
        this._expireDate = value;
        if(this.accessor?.['accountExpires']) {
            this.accessor['accountExpires'] = [ value ];
        }
    } 
    get expireDate(): string {
        return this._expireDate;
    }
}