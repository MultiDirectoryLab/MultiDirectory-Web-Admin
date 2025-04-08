import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { SearchResult } from '@features/search/models/search-result';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SearchEntry } from '@models/entry/search-response';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  AlertComponent,
  ButtonComponent,
  ContextMenuEvent,
  DatagridComponent,
  DropdownMenuComponent,
  DropdownOption,
  Page,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-kerberos-principals',
  styleUrls: ['./kerberos-principals.component.scss'],
  templateUrl: './kerberos-principals.component.html',
  imports: [
    ButtonComponent,
    TranslocoPipe,
    TextboxComponent,
    FormsModule,
    DatagridComponent,
    AlertComponent,
    FaIconComponent,
    DropdownMenuComponent,
  ],
})
export class KerberosPrincipalsComponent implements OnInit, OnDestroy {
  private api = inject(MultidirectoryApiService);
  private app = inject(AppSettingsService);
  private ldapLoader = inject(LdapEntryLoader);
  private windows = inject(AppWindowsService);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private _kadminPrefixes = ['K/', 'krbtgt/', 'kadmin/', 'kiprop/'];
  private _userPrincipalRegex = new RegExp('^[^/]+@.*$');
  private _unsubscribe = new Subject<void>();
  readonly grid = viewChild.required<DatagridComponent>('grid');
  readonly principalMenu = viewChild.required<DropdownMenuComponent>('principalMenu');
  faCircleExclamation = faCircleExclamation;
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
  KerberosStatusEnum = KerberosStatuses;
  kerberosStatus = KerberosStatuses.NOT_CONFIGURED;

  private _searchQuery = '';

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(query: string) {
    this._searchQuery = query;
    this.updateContent();
  }

  ngOnInit(): void {
    this.app.kerberosStatusRx.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.kerberosStatus = x;
    });
    this.updateContent();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  filterPrincipals(entry: SearchEntry) {
    const object_name =
      entry?.partial_attributes?.find((x) => x.type == 'cn')?.vals?.[0] ?? entry.object_name;
    const isKerberosPrincipal = this._kadminPrefixes.some((x) => object_name.startsWith(x));
    const isUserPrincipal = this._userPrincipalRegex.test(object_name);
    return !isKerberosPrincipal && !isUserPrincipal;
  }

  updateContent() {
    this.ldapLoader
      .get()
      .pipe(
        switchMap((x) =>
          this.api.search(SearchQueries.getKdcPrincipals(x[0].id, this._searchQuery)),
        ),
        catchError((err) => {
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.columns = [
          { name: translate('kerberos-settings.name-column'), prop: 'name', flexGrow: 1 },
        ];
        this.principals = res.search_result
          .map((x) => {
            x.object_name = x.object_name.replace('krbprincipalname=', '');
            return x;
          })
          .filter((x) => this.filterPrincipals(x))
          .map(
            (node) =>
              <SearchResult>{
                name:
                  node?.partial_attributes?.find((x) => x.type == 'cn')?.vals?.[0] ??
                  node.object_name,
              },
          );
        this.cdr.detectChanges();
      });
  }

  onPageChanged($event: Page) {}

  onDoubleClick($event: InputEvent) {}

  exportKeytab() {
    const grid = this.grid();
    if (!grid?.selected?.length) {
      this.toastr.error(translate('kerberos-settings.should-select-principals'));
      return;
    }
    const selected = grid.selected as SearchResult[];
    const selectedName = selected.map((x) => {
      let name = x.name;
      const hasRealmIndex = x.name.indexOf('@');
      if (hasRealmIndex > 0) {
        name = name.substring(0, hasRealmIndex);
      }
      return name.replace('krbprincipalname=', '');
    });
    if (!selectedName) {
      this.toastr.error(translate('kerberos-settings.should-select-principals'));
      return;
    }
    this.windows.showSpinner();
    this.api
      .ktadd(selectedName)
      .pipe(
        catchError((err) => {
          this.windows.hideSpinner();
          this.toastr.error(err);
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        var newBlob = new Blob([x], { type: 'application/text' });

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = 'krb5.keytab';
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window }),
        );
        this.windows.hideSpinner();
        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      });
  }

  addPrincipal() {
    this.windows
      .openAddPrincipalDialog()
      .pipe(take(1))
      .subscribe((x) => {
        this.updateContent();
      });
  }

  setupKerberos() {
    this.windows
      .openSetupKerberosDialog()
      .pipe(take(1))
      .subscribe((x) => {});
  }

  handleRightClick(e: ContextMenuEvent) {
    // TODO
  }
}
