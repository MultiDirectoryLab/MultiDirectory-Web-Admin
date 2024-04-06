import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import BitSet from "bitset";
import { DropdownOption, ModalInjectDirective } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { UserAccountControlFlag } from "projects/multidirectory-app/src/app/core/ldap/user-account-control-flags";
import { LdapEntryLoader } from "projects/multidirectory-app/src/app/core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";
import { AttributeService } from "projects/multidirectory-app/src/app/services/attributes.service";
import { take, tap } from "rxjs";

@Component({
    selector: 'app-user-properties-account',
    templateUrl: './user-properties-account.component.html',
    styleUrls: ['./user-properties-account.component.scss']
})
export class UserPropertiesAccountComponent implements AfterViewInit {
    UserAccountControlFlag = UserAccountControlFlag;
    domains: DropdownOption[] = []
    accessor!: LdapAttributes;
    uacBitSet?: BitSet;
    upnDomain?: DropdownOption;
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
            this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 1);
            this.accessor['userAccountControl'] = [ this.uacBitSet?.toString(10) ];
            return;
        }
        this.accessor['pwdLastSet'] = [ Date.now().toString() ];
        this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 0);
        this.accessor['userAccountControl'] = [ this.uacBitSet?.toString(10) ];
    }

    constructor(private attributes: AttributeService, private cdr: ChangeDetectorRef, private nodeLoader: LdapEntryLoader) {
    }

    ngAfterViewInit(): void {
        this.attributes.entityAccessorRx().pipe(
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
        
        this.nodeLoader.get().pipe(take(1)).subscribe(domains => {
            this.domains = domains.map(x => new DropdownOption({
                title: x.name,
                value: x.id
            }));
            this.upnDomain = this.domains?.[0]?.value;
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