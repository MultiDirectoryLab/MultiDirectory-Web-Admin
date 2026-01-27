import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchResult } from '@features/search/models/search-result';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  AlertComponent,
  ButtonComponent,
  DatagridComponent,
  DropdownMenuComponent,
  DropdownOption,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, from, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';
import { AddPrincipalDialogComponent } from '../../../components/modals/components/dialogs/add-principal-dialog/add-principal-dialog.component';
import { AddPrincipalDialogData, AddPrincipalDialogReturnData } from '../../../components/modals/interfaces/add-principal-dialog.interface';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { SearchEntry } from '@models/api/entry/search-entry';
import { KerberosStatuses } from '@models/api/kerberos/kerberos-status';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { SearchQueries } from '@core/ldap/search';
import { TableColumn } from 'ngx-datatable-gimefork';

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
  private windows = inject(AppWindowsService);
  private toastr = inject(ToastrService);
  private _kadminPrefixes = ['K/', 'krbtgt/', 'kadmin/', 'kiprop/'];
  private _userPrincipalRegex = new RegExp('^[^/]+@.*$');
  private _unsubscribe = new Subject<void>();
  private dialogService = inject(DialogService);
  private ldapTreeview = inject(LdapTreeviewService);
  readonly grid = viewChild.required<DatagridComponent>('grid');
  faCircleExclamation = faCircleExclamation;
  principals: SearchResult[] = [];
  columns: TableColumn[] = [];
  total = 0;

  private _limit = 20;
  get limit(): number {
    return this._limit;
  }
  set limit(limit: number) {
    this._limit = limit;
    this.updateContent();
  }

  private _offset = 0;
  get offset(): number {
    return this._offset;
  }
  set offset(offset: number) {
    this._offset = offset;
    this.updateContent();
  }

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
    const object_name = entry?.partial_attributes?.find((x) => x.type == 'cn')?.vals?.[0] ?? entry.object_name;
    const isKerberosPrincipal = this._kadminPrefixes.some((x) => object_name.startsWith(x));
    const isUserPrincipal = this._userPrincipalRegex.test(object_name);
    return !isKerberosPrincipal && !isUserPrincipal;
  }

  updateContent() {
    from(this.ldapTreeview.load(''))
      .pipe(
        take(1),
        switchMap((x) => this.api.search(SearchQueries.getKdcPrincipals(x[0].id, this._searchQuery))),
        catchError((err) => {
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.columns = [{ name: translate('kerberos-settings.name-column'), prop: 'name', flexGrow: 1 }];
        this.principals = res.search_result
          .map((x) => {
            x.object_name = x.object_name.replace('krbprincipalname=', '');
            return x;
          })
          .filter((x) => this.filterPrincipals(x))
          .map(
            (node) =>
              ({
                name: node?.partial_attributes?.find((x) => x.type == 'cn')?.vals?.[0] ?? node.object_name,
              }) as SearchResult,
          );
        this.total = this.principals.length;
      });
  }

  onPageChanged($event: number) {}
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
    this.api.ktadd(selectedName).subscribe((x) => {
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const newBlob = new Blob([x], { type: 'application/text' });

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      const link = document.createElement('a');
      link.href = data;
      link.download = 'krb5.keytab';
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      this.windows.hideSpinner();
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }

  addPrincipal() {
    this.dialogService
      .open<AddPrincipalDialogReturnData, AddPrincipalDialogData, AddPrincipalDialogComponent>({
        component: AddPrincipalDialogComponent,
        dialogConfig: { minHeight: '360px' },
      })
      .closed.pipe(take(1))
      .subscribe(() => {
        this.updateContent();
      });
  }

  setupKerberos() {
    this.windows.openSetupKerberosDialog().pipe(take(1)).subscribe();
  }
}
