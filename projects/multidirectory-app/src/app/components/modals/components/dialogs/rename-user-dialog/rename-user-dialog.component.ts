import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { DialogService } from '../../../services/dialog.service';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { LdapModificationRecord, LdapRenameRequest } from '@core/ldap/ldap-rename.request';
import { from, take } from 'rxjs';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { SearchQueries } from '@core/ldap/search';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

@Component({
  selector: 'app-rename-user-dialog',
  templateUrl: './rename-user-dialog.component.html',
  styleUrls: ['./rename-user-dialog.component.scss'],
  imports: [DialogComponent, ReactiveFormsModule, TranslocoModule, MultidirectoryUiKitModule],
})
export class RenameUserDialogComponent implements OnInit {
  private dialogRef = inject(DialogRef);
  private dialog = inject(DialogService);
  private ldapTreeviewService = inject(LdapTreeviewService);
  private api = inject(MultidirectoryApiService);
  private cdr = inject(ChangeDetectorRef);
  private id: string = inject(DIALOG_DATA);
  private fb = inject(FormBuilder);

  protected form = this.fb.nonNullable.group({
    cn: new FormControl('', [Validators.required]),
    surname: new FormControl(''),
    givenName: new FormControl(''),
    displayName: new FormControl(''),
    userPrincipalName: new FormControl('', [Validators.required]),
    upnDomain: new FormControl<DropdownOption | null>(null, [Validators.required]),
  });

  protected domains: DropdownOption[] = [];
  protected accessor!: LdapAttributes;
  private _dn!: string;

  ngOnInit() {
    this.loadUser();
  }

  protected onSubmit() {
    this.dialog.close(this.dialogRef, this.buildRenameRequest());
  }

  private loadDomains(domainUpn: string) {
    from(this.ldapTreeviewService.load(''))
      .pipe(take(1))
      .subscribe((ldapTree) => {
        this.domains = ldapTree.map(
          (x) =>
            new DropdownOption({
              title: x.name,
              value: x.name,
            }),
        );
        this.cdr.detectChanges();

        const domain = this.domains.find((x) => x.value === domainUpn);
        if (domain) {
          this.form.controls.upnDomain.setValue(domain);
        }
      });
  }

  private loadUser() {
    this.api
      .search(SearchQueries.getUserProperties(this.id))
      .pipe(take(1))
      .subscribe((props) => {
        const attributes = props.search_result[0].partial_attributes;
        this.hydrateForm(attributes);
        this.cdr.detectChanges();
      });
  }

  private hydrateForm(attributes: LdapAttribute[]) {
    this.form.controls.cn.setValue(attributes.find((t) => t.type === 'cn')!.vals[0]);
    this.form.controls.surname.setValue(attributes.find((t) => t.type === 'surname')?.vals[0] || '');
    this.form.controls.givenName.setValue(attributes.find((t) => t.type === 'givenName')!.vals[0]);
    this.form.controls.displayName.setValue(attributes.find((t) => t.type === 'displayName')!.vals[0]);

    this._dn = attributes.find((t) => t.type === 'distinguishedName')!.vals[0];

    const upn = attributes.find((t) => t.type === 'userPrincipalName')!.vals[0];
    const upnName = upn.substring(0, upn.indexOf('@'));
    const upnDomain = upn.substring(upn.indexOf('@') + 1);

    this.form.controls.userPrincipalName.setValue(upnName);
    this.loadDomains(upnDomain);
  }

  private getUserPrincipalName(): string {
    const controls = this.form.controls;
    const login = controls.userPrincipalName.getRawValue()!;
    const domain = (controls.upnDomain.getRawValue()! as DropdownOption).value;

    return `${login}@${domain}`;
  }

  private buildRenameRequest(): LdapRenameRequest {
    const userName = this.form.controls.cn.getRawValue();
    const dn = this._dn;

    if (!userName || !dn) {
      return {} as LdapRenameRequest;
    }

    const controls = this.form.controls;
    const newCn = `cn=${userName}`;
    const upn = this.getUserPrincipalName();

    return {
      object: dn,
      newrdn: newCn,
      changes: [
        new LdapModificationRecord(2, { type: 'displayName', vals: [controls.displayName.getRawValue()!] }),
        new LdapModificationRecord(2, { type: 'givenName', vals: [controls.givenName.getRawValue()!] }),
        new LdapModificationRecord(2, { type: 'sAMAccountName', vals: [controls.userPrincipalName.getRawValue()!] }),
        new LdapModificationRecord(2, { type: 'userPrincipalName', vals: [upn] }),
        new LdapModificationRecord(2, { type: 'surname', vals: [controls.surname.getRawValue()!] }),
      ],
    };
  }

  protected cancel() {
    this.dialog.close(this.dialogRef, null);
  }
}
