import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { TableColumn } from 'ngx-datatable-gimefork';
import { ContextMenuEvent, DatagridComponent, DropdownOption } from 'multidirectory-ui-kit';
import { concat, Subject, switchMap, take } from 'rxjs';
import { LdapBrowserEntry } from '../../../../../../models/core/ldap-browser/ldap-browser-entry';
import { translate } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { AppNavigationService } from '@services/app-navigation.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {
  faCrosshairs,
  faLevelUpAlt,
  faToggleOff,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { BulkService } from '@services/bulk.service';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { RightClickEvent } from '@models/core/context-menu/right-click-event';

@Component({
  selector: 'app-table-view',
  styleUrls: ['table-view.component.scss'],
  templateUrl: './table-view.component.html',
})
export class TableViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('grid', { static: true }) grid!: DatagridComponent;
  @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
  @Output() rightClick = new EventEmitter<RightClickEvent>();
  private _searchQuery = '';
  @Input() set searchQuery(q: string) {
    this._searchQuery = q;
  }
  get searchQuery() {
    return this._searchQuery;
  }

  private _dn = '';
  page = 0;
  columns: TableColumn[] = [];
  @Input() rows: LdapBrowserEntry[] = [];
  unsubscribe = new Subject<void>();
  faToggleOff = faToggleOff;
  faTrashAlt = faTrashAlt;
  faCrosshair = faCrosshairs;
  faLevelUp = faLevelUpAlt;
  showControlPanel = true;

  private _checkAllCheckbox = false;
  get checkAllCheckbox() {
    return this._checkAllCheckbox;
  }
  set checkAllCheckbox(value: boolean) {
    this._checkAllCheckbox = value;
    this.grid.toggleSelectedAll(value);
  }

  pageSizes: DropdownOption[] = [
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];
  constructor(
    private appNavigation: AppNavigationService,
    private bulkService: BulkService<NavigationNode>,
    private windows: AppWindowsService,
    private cdr: ChangeDetectorRef,
    private api: MultidirectoryApiService,
    private getAccessorStrategy: GetAccessorStrategy,
    private completeUpdateEntiresStrategy: CompleteUpdateEntiresStrategies,
  ) {}

  ngAfterViewInit(): void {
    this.columns = [
      {
        name: translate('table-view.name-column'),
        cellTemplate: this.iconColumn,
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
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
  }

  onPageChanged(event: number) {
    // todo
  }

  getSelected(): NavigationNode[] {
    return this.grid.selected.map((x) => x.entry);
  }
  setSelected(selected: NavigationNode[]) {
    if (!this.rows || this.rows.length == 0 || !selected) {
      return;
    }
    this.grid.selected = this.rows.filter((x) => selected.findIndex((y) => y.id == x.dn) > -1);
    //this.navigation.setSelection(selected);
    this.cdr.detectChanges();
  }

  onDoubleClick(event: any) {
    const entry = event?.row?.entry;
    if (event?.row?.name == '...') {
      //this.navigation.setCatalog(this.selectedCatalog?.parent!);
    } else if (entry && entry.expandable) {
      this.appNavigation.navigate(entry);
    } else if (entry && !entry.expandable) {
      this.windows
        .openEntityProperiesModal(entry)
        .pipe(take(1))
        .subscribe((x) => {
          //this.updateContentInner(this.route.snapshot.queryParams['distinguishedName']);
        });
    }
    this.cdr.detectChanges();
  }

  onRowSelect(event: any) {
    this.showControlPanel = this.grid.selected.length > 0;
    this.cdr.detectChanges();
    this._checkAllCheckbox = false;
    this.setAccountEnabledToggle();
  }

  onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.windows
      .openDeleteEntryConfirmation(this.grid.selected.map((x) => x.entry.id))
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          concat(
            ...this.grid.selected.map((x) =>
              this.api.delete(
                new DeleteEntryRequest({
                  entry: (<any>x.entry).id,
                }),
              ),
            ),
          ).subscribe((x) => {});
        }
      });
  }

  toggleSelected(enabled: boolean) {
    const toChange = this.bulkService
      .create(this.grid.selected.map((x) => x.entry))
      .mutate<LdapAttributes>(this.getAccessorStrategy)
      .filter(new FilterControllableStrategy());

    const changed =
      '<ul>' + this.grid.selected.map((x) => `<li>${x.entry.id}</li>`).join('') + '</ul>';

    toChange
      .mutate<LdapAttributes>(new ToggleAccountDisableStrategy(enabled))
      .complete<UpdateEntryResponse>(this.completeUpdateEntiresStrategy)
      .pipe(take(1))
      .pipe(
        switchMap((x) => {
          let all =
            translate('toggle-account.accounts-was-toggled') +
            (enabled ? translate('toggle-account.enabled') : translate('toggle-account.disabled')) +
            ':';

          all += '<br/>' + changed;

          return this.windows.openConfirmDialog({
            promptText: all,
            promptHeader: translate('toggle-account.header'),
            primaryButtons: [{ id: 'ok', text: translate('toggle-account.ok') }],
            secondaryButtons: [],
          });
        }),
      )
      .subscribe((result) => {});
  }

  private _accountEnabledToggle = false;
  get accountEnabledToggle(): boolean {
    return this._accountEnabledToggle;
  }
  set accountEnabledToggle(enabled: boolean) {
    this._accountEnabledToggle = enabled;
  }
  accountEnabledToggleClick(value: boolean) {
    this.toggleSelected(this._accountEnabledToggle);
  }

  accountEnabledToggleEnabled = false;
  setAccountEnabledToggle() {
    const selected = this.grid.selected.map((x) => x.entry);
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

  handleGoToParent(event: MouseEvent) {
    const dn = LdapNamesHelper.getDnParent(this._dn);
  }

  handleRightClick($event: ContextMenuEvent) {}
}
