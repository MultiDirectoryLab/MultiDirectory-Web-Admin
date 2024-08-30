import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { TableColumn } from 'ngx-datatable-gimefork';
import {
  CheckboxComponent,
  DatagridComponent,
  DropdownMenuComponent,
  DropdownOption,
  Page,
  Treenode,
} from 'multidirectory-ui-kit';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { concat, Subject, take } from 'rxjs';
import { TableRow } from './table-row';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { translate } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { AppNavigationService, NavigationEvent } from '@services/app-navigation.service';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BaseViewComponent } from '../base-view.component';
import {
  faCircleExclamation,
  faCrosshairs,
  faL,
  faToggleOff,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DeleteEntryRequest } from '@models/entry/delete-request';
import { ToastrService } from 'ngx-toastr';
import { BulkService } from '@services/bulk.service';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { UpdateEntryResponse } from '@models/entry/update-response';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';

@Component({
  selector: 'app-table-view',
  styleUrls: ['table-view.component.scss'],
  templateUrl: './table-view.component.html',
  providers: [{ provide: BaseViewComponent, useExisting: forwardRef(() => TableViewComponent) }],
})
export class TableViewComponent extends BaseViewComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: true }) grid!: DatagridComponent;
  @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
  private _searchQuery = '';
  @Input() set searchQuery(q: string) {
    this._searchQuery = q;
    this.updateContent();
  }
  get searchQuery() {
    return this._searchQuery;
  }

  private _dn = '';
  page = new Page();
  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  unsubscribe = new Subject<void>();
  faToggleOff = faToggleOff;
  faTrashAlt = faTrashAlt;
  faCrosshair = faCrosshairs;
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
    private ldapLoader: LdapEntryLoader,
    private toastr: ToastrService,
    private bulkService: BulkService<LdapEntryNode>,
    private windows: AppWindowsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private api: MultidirectoryApiService,
    private accessorStrategy: GetAccessorStrategy,
    private completeUpdateEntiresStrategy: CompleteUpdateEntiresStrategies,
  ) {
    super();
  }

  ngOnInit(): void {
    const pageSize = localStorage.getItem('gridSize_table-view');
    if (pageSize && !isNaN(parseFloat(pageSize))) {
      this.page.size = Math.floor(parseFloat(pageSize));
    }
    this.columns = [
      {
        name: translate('table-view.name-column'),
        cellTemplate: this.iconColumn,
        flexGrow: 1,
        checkboxable: true,
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

  onPageChanged(event: Page) {
    this.page = event;
    this.updateContent();
  }

  updateContentInner(dn: string) {
    if (dn !== this._dn) {
      this.page.pageNumber = 1;
      this._dn = dn;
    }
    this.ldapLoader
      .getContent(dn, this.searchQuery)
      .pipe(take(1))
      .subscribe((rows) => {
        this.rows = rows.map(
          (node) =>
            <TableRow>{
              icon: node.icon,
              name: node.name,
              type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
              entry: node,
              description: node.entry ? EntityInfoResolver.getNodeDescription(node) : '',
              status: node.entry ? EntityInfoResolver.getNodeStatus(node) : '',
            },
        );
        this.grid.page.totalElements = this.rows.length;
        this.rows = this.rows.slice(
          this.page.pageOffset * this.page.size,
          this.page.pageOffset * this.page.size + this.page.size,
        );

        if (this.grid.selected?.length > 0) {
          const selected = this.grid.selected.map((x) => x.entry.id);
          this.grid.selected = [];
          this.rows.forEach((row) => {
            if (selected.includes(row.entry.id)) {
              this.grid.selected.push(row);
            }
          });
        } else {
          this.accountEnabledToggle = false;
          this.accountEnabledToggleEnabled = false;
        }
        this.showControlPanel = true;
        this.cdr.detectChanges();
      });
  }

  override updateContent() {
    this.updateContentInner(this.route.snapshot.queryParams['distinguishedName']);
  }

  override getSelected(): LdapEntryNode[] {
    return this.grid.selected.map((x) => x.entry);
  }
  override setSelected(selected: LdapEntryNode[]) {
    if (!this.rows || this.rows.length == 0 || !selected) {
      return;
    }
    this.grid.selected = this.rows.filter(
      (x) => selected.findIndex((y) => y.id == x.entry.id) > -1,
    );
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
          this.updateContentInner(this.route.snapshot.queryParams['distinguishedName']);
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
          ).subscribe((x) => {
            this.appNavigation.reload();
          });
        }
      });
  }

  toggleSelected(enabled: boolean) {
    const toChange = this.bulkService
      .create(this.grid.selected.map((x) => x.entry))
      .mutate<LdapAttributes>(this.accessorStrategy)
      .filter(new FilterControllableStrategy());

    toChange
      .mutate<LdapAttributes>(new ToggleAccountDisableStrategy(enabled))
      .complete<UpdateEntryResponse>(this.completeUpdateEntiresStrategy)
      .pipe(take(1))
      .subscribe((result) => {
        this.updateContent();
      });
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
      .mutate<LdapAttributes>(this.accessorStrategy)
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
}
