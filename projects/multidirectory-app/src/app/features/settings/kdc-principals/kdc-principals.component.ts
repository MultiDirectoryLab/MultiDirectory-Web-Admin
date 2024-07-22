import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { SearchResult } from '@features/search/models/search-result';
import { translate } from '@ngneat/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { TableColumn } from '@swimlane/ngx-datatable';
import { DatagridComponent, DropdownOption, Page } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-kdc-principals',
  styleUrls: ['./kdc-principals.component.scss'],
  templateUrl: './kdc-principals.component.html',
})
export class KdcPrincipalsComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: DatagridComponent;
  principals: SearchResult[] = [];
  columns: TableColumn[] = [];
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
    private toastr: ToastrService,
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
        this.columns = [{ name: translate('kdc-settings.name-column'), prop: 'name', flexGrow: 1 }];
        console.log(res.search_result);
        this.principals = res.search_result.map(
          (node) =>
            <SearchResult>{
              name:
                node?.partial_attributes?.find((x) => x.type == 'cn')?.vals?.[0] ??
                node.object_name,
            },
        );
        this.cdr.detectChanges();
        //this.spinner.hide();
      });
  }

  onPageChanged($event: Page) {}
  onDoubleClick($event: InputEvent) {}

  callKtAdd() {
    const selected = this.grid.selected as SearchResult[];
    const selectedName = selected?.[0]?.name;
    if (!selectedName) {
      this.toastr.error(translate('kdc-settings.should-select-principals'));
      return;
    }
    this.api.ktadd([selectedName]).subscribe((x) => {
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
