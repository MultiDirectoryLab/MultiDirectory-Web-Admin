import { NgClass } from '@angular/common';
import {
  Component,
  forwardRef,
  AfterViewInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
  viewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faToggleOff,
  faTrashAlt,
  faCrosshairs,
  faLevelUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import { TranslocoPipe, translate } from '@jsverse/transloco';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { LdapBrowserEntry } from '@models/core/ldap-browser/ldap-browser-entry';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { BulkService } from '@services/bulk.service';
import { LdapBrowserService } from '@services/ldap/ldap-browser.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  CheckboxComponent,
  ContextMenuEvent,
  DatagridComponent,
  DropdownOption,
  PlaneButtonComponent,
  RightClickEvent,
  ShiftCheckboxComponent,
} from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { ConfirmDeleteDialogComponent } from 'projects/multidirectory-app/src/app/components/modals/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from 'projects/multidirectory-app/src/app/components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import { EntityPropertiesDialogComponent } from 'projects/multidirectory-app/src/app/components/modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';
import {
  ConfirmDeleteDialogReturnData,
  ConfirmDeleteDialogData,
} from 'projects/multidirectory-app/src/app/components/modals/interfaces/confirm-delete-dialog.interface';
import {
  ConfirmDialogReturnData,
  ConfirmDialogData,
} from 'projects/multidirectory-app/src/app/components/modals/interfaces/confirm-dialog.interface';
import {
  EntityPropertiesDialogReturnData,
  EntityPropertiesDialogData,
} from 'projects/multidirectory-app/src/app/components/modals/interfaces/entity-properties-dialog.interface';
import { DialogService } from 'projects/multidirectory-app/src/app/components/modals/services/dialog.service';
import { AppNavigationService } from 'projects/multidirectory-app/src/app/services/app-navigation.service';
import {
  BehaviorSubject,
  Subject,
  takeUntil,
  combineLatest,
  switchMap,
  take,
  of,
  concat,
} from 'rxjs';

@Component({
  selector: 'app-table-view',
  styleUrls: ['table-view.component.scss'],
  templateUrl: './table-view.component.html',
  imports: [
    DatagridComponent,
    TranslocoPipe,
    CheckboxComponent,
    FormsModule,
    PlaneButtonComponent,
    ShiftCheckboxComponent,
    NgClass,
    FaIconComponent,
  ],
})
export class TableViewComponent implements AfterViewInit, OnDestroy {
  private dialogService = inject(DialogService);
  private appNavigation = inject(AppNavigationService);
  private bulkService = inject<BulkService<NavigationNode>>(BulkService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private api = inject(MultidirectoryApiService);
  private getAccessorStrategy = inject(GetAccessorStrategy);
  private completeUpdateEntiresStrategy = inject(CompleteUpdateEntiresStrategies);
  private activatedRoute = inject(ActivatedRoute);
  private ldapContent = inject(LdapBrowserService);

  private _dn = '';
  readonly grid = viewChild.required<DatagridComponent>('grid');
  readonly iconColumn = viewChild.required<TemplateRef<HTMLElement>>('iconTemplate');

  @Output() rightClick = new EventEmitter<RightClickEvent>();
  columns: TableColumn[] = [];
  rows: LdapBrowserEntry[] = [];
  unsubscribe = new Subject<void>();
  faToggleOff = faToggleOff;
  faTrashAlt = faTrashAlt;
  faCrosshair = faCrosshairs;
  faLevelUp = faLevelUpAlt;
  showControlPanel = true;
  pageSizes: DropdownOption[] = [
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];
  accountEnabledToggleEnabled = false;

  private _searchQuery = '';
  private _searchQueryRx = new BehaviorSubject(this._searchQuery);
  @Input() set searchQuery(q: string) {
    if (this._searchQuery != q) {
      this._searchQuery = q;
      this._searchQueryRx.next(q);
    }
  }
  get searchQuery() {
    return this._searchQuery;
  }

  private _checkAllCheckbox = false;

  get checkAllCheckbox() {
    return this._checkAllCheckbox;
  }

  set checkAllCheckbox(value: boolean) {
    this._checkAllCheckbox = value;
    this.grid().toggleSelectedAll(value);
  }

  private _accountEnabledToggle = false;

  get accountEnabledToggle(): boolean {
    return this._accountEnabledToggle;
  }
  private _parentDn = '';
  private _parentDnRx = new BehaviorSubject(this._parentDn);
  get parentDn(): string {
    return this._parentDn;
  }
  set parentDn(dn: string) {
    if (this._parentDn != dn) {
      this._parentDn = dn;
      this._parentDnRx.next(dn);
    }
  }

  set accountEnabledToggle(enabled: boolean) {
    this._accountEnabledToggle = enabled;
  }
  private _limit = this.pageSizes[0].value;
  private _limitRx = new BehaviorSubject(this._limit);
  get limit() {
    return this._limit;
  }
  set limit(limit: number) {
    if (this._limit != limit) {
      this._offset = 0;
      this._limit = limit;
      this._limitRx.next(limit);
    }
  }

  private _offset = 0;
  private _offsetRx = new BehaviorSubject(this._offset);
  get offset() {
    return this._offset;
  }
  set offset(offset: number) {
    if (this._offset != offset) {
      this._offset = offset;
      this._offsetRx.next(offset);
    }
  }

  private _total = 0;
  private _totalRx = new BehaviorSubject(this._total);
  get total() {
    return this._total;
  }
  set total(total: number) {
    if (this._total != total) {
      this._total = total;
      this._totalRx.next(total);
    }
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.columns = [
      {
        name: translate('table-view.name-column'),
        cellTemplate: this.iconColumn(),
        flexGrow: 1,
        checkboxable: true,
        comparator: (
          valueA: LdapBrowserEntry,
          valueB: LdapBrowserEntry,
          rowA: LdapBrowserEntry,
          rowB: LdapBrowserEntry,
          sortDirection: string,
        ) => {
          if (valueA.name === valueB.name) {
            return 0;
          }

          if (sortDirection === 'asc') {
            return valueA.name > valueB.name ? 1 : -1;
          }
          return valueB.name > valueA.name ? -1 : 1;
        },
      },
      { name: translate('table-view.type-column'), prop: 'type', flexGrow: 1 },
      { name: translate('table-view.description-column'), prop: 'description', flexGrow: 3 },
      { name: translate('table-view.status-column'), prop: 'status', flexGrow: 3 },
    ];

    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((queryParams) => {
      const dn = queryParams['distinguishedName'];
      this.parentDn = dn;
    });

    combineLatest([this._parentDnRx, this._searchQueryRx, this._offsetRx, this._limitRx])
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap(([parentDn, searchQuery, offset, limit]) => {
          return this.ldapContent.loadContent(parentDn, searchQuery, this.offset, this.limit);
        }),
      )
      .subscribe(([rows, totalPages, totalEntires]) => {
        this.rows = rows;
        this.total = totalEntires;
      });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
  }

  onPageChanged(pageNumber: number) {
    // todo
    this.offset = pageNumber * this.limit;
  }

  getSelected(): NavigationNode[] {
    return this.grid().selected.map((x) => x.entry);
  }

  setSelected(selected: NavigationNode[]) {
    if (!this.rows || this.rows.length == 0 || !selected) {
      return;
    }
    this.grid().selected = this.rows.filter((x) => selected.findIndex((y) => y.id == x.dn) > -1);
    //this.navigation.setSelection(selected);
    this.cdr.detectChanges();
  }

  onDoubleClick(event: any) {
    const entry = event?.row?.entry;

    if (entry && entry.expandable) {
      this.appNavigation.navigate(entry);
    } else if (entry && !entry.expandable) {
      this.dialogService
        .open<
          EntityPropertiesDialogReturnData,
          EntityPropertiesDialogData,
          EntityPropertiesDialogComponent
        >({
          component: EntityPropertiesDialogComponent,
          dialogConfig: {
            hasBackdrop: false,
            width: '600px',
            minHeight: '660px',
            data: { entity: entry },
          },
        })
        .closed.pipe(take(1))
        .subscribe(() => {
          //this.updateContentInner(this.route.snapshot.queryParams['distinguishedName']);
        });
    }
    this.cdr.detectChanges();
  }

  onRowSelect() {
    this.showControlPanel = this.grid().selected.length > 0;
    this.cdr.detectChanges();
    this._checkAllCheckbox = false;
    this.setAccountEnabledToggle();
  }

  onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.dialogService
      .open<ConfirmDeleteDialogReturnData, ConfirmDeleteDialogData, ConfirmDeleteDialogComponent>({
        component: ConfirmDeleteDialogComponent,
        dialogConfig: {
          width: '580px',
          data: {
            toDeleteDNs: this.grid().selected.map((x) => x.entry.id),
          },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((confirmed) => {
          if (!confirmed) return of(confirmed);

          return concat(
            ...this.grid().selected.map((x) =>
              this.api.delete(
                new DeleteEntryRequest({
                  entry: (x.entry as any).id,
                }),
              ),
            ),
          );
        }),
      )
      .subscribe(() => {
        //this.appNavigation.reload();
      });
  }

  toggleSelected(enabled: boolean) {
    const toChange = this.bulkService
      .create(this.grid().selected.map((x) => x.entry))
      .mutate<LdapAttributes>(this.getAccessorStrategy)
      .filter(new FilterControllableStrategy());

    const changed =
      '<ul>' +
      this.grid()
        .selected.map((x) => `<li>${x.entry.id}</li>`)
        .join('') +
      '</ul>';

    toChange
      .mutate<LdapAttributes>(new ToggleAccountDisableStrategy(enabled))
      .complete<UpdateEntryResponse>(this.completeUpdateEntiresStrategy)
      .pipe(take(1))
      .pipe(
        switchMap(() => {
          let all =
            translate('toggle-account.accounts-was-toggled') +
            (enabled ? translate('toggle-account.enabled') : translate('toggle-account.disabled')) +
            ':';

          all += '<br/>' + changed;

          return this.dialogService.open<
            ConfirmDialogReturnData,
            ConfirmDialogData,
            ConfirmDialogComponent
          >({
            component: ConfirmDialogComponent,
            dialogConfig: {
              minHeight: '160px',
              data: {
                promptText: all,
                promptHeader: translate('toggle-account.header'),
                primaryButtons: [{ id: 'ok', text: translate('toggle-account.ok') }],
                secondaryButtons: [],
              },
            },
          }).closed;
        }),
      )
      .subscribe(() => {});
  }

  accountEnabledToggleClick() {
    this.toggleSelected(this._accountEnabledToggle);
  }

  setAccountEnabledToggle() {
    const selected = this.grid().selected.map((x) => x.entry);
    this.bulkService
      .create(selected)
      .mutate<LdapAttributes>(this.getAccessorStrategy)
      .filter(new FilterControllableStrategy())
      .complete<boolean>(new CheckAccountEnabledStateStrategy())
      .pipe(take(1))
      .subscribe((result) => {
        if (result == null) {
          this.accountEnabledToggle = result;
          this.accountEnabledToggleEnabled = false;
        }
        this.accountEnabledToggle = result;
        this.accountEnabledToggleEnabled = true;
      });
  }

  handleGoToParent() {
    const dn = LdapNamesHelper.getDnParent(this._dn);
  }

  handleRightClick($event: ContextMenuEvent) {}
}
