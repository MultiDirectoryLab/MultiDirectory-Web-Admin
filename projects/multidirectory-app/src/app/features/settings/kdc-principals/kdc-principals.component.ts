import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { SearchResult } from '@features/search/models/search-result';
import { translate } from '@ngneat/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DropdownOption, Page } from 'multidirectory-ui-kit';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-kdc-principals',
  styleUrls: ['./kdc-principals.component.scss'],
  templateUrl: './kdc-principals.component.html',
})
export class KdcPrincipalsComponent implements OnInit {
  principals: SearchResult[] = [];
  columns = [{ name: translate('kdc-settings.name-column'), prop: 'name', flexGrow: 1 }];
  pageSizes: DropdownOption[] = [
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];
  page = new Page();

  constructor(
    private api: MultidirectoryApiService,
    private ldapLoader: LdapEntryLoader,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.ldapLoader
      .get()
      .pipe(
        switchMap((x) => this.api.search(SearchQueries.getKdcPrincipals(x[0].id))),
        catchError((err) => {
          //this.spinner.hide();
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.principals = res.search_result.map(
          (node) =>
            <SearchResult>{
              name: node.object_name,
            },
        );
        console.log(this.principals);
        this.cdr.detectChanges();
        //this.spinner.hide();
      });
  }

  onPageChanged($event: Page) {}
  onDoubleClick($event: InputEvent) {}

  callKtAdd() {
    this.api
      .ktadd([
        'krbprincipalname=krbtgt/LOCALHOST.DEV@LOCALHOST.DEV,cn=LOCALHOST.DEV,cn=kerberos,ou=services,dc=localhost,dc=dev',
      ])
      .subscribe((x) => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        var newBlob = new Blob([x], { type: 'application/text' });

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'keytab';
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window }),
        );

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      });
  }
}
