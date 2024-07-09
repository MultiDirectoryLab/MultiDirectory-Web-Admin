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
}
