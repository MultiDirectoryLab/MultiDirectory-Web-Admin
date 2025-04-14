import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCrosshairs,
  faLevelUpAlt,
  faToggleOff,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DeleteEntryRequest } from '@models/entry/delete-request';
import { UpdateEntryResponse } from '@models/entry/update-response';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppWindowsService } from '@services/app-windows.service';
import { BulkService } from '@services/bulk.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  CheckboxComponent,
  DatagridComponent,
  DropdownOption,
  Page,
  PlaneButtonComponent,
  ShiftCheckboxComponent,
} from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { concat, of, Subject, switchMap, take } from 'rxjs';
import { ConfirmDeleteDialogComponent } from '../../../../../../components/modals/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from '../../../../../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import { EntityPropertiesDialogComponent } from '../../../../../../components/modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';
import {
  ConfirmDeleteDialogData,
  ConfirmDeleteDialogReturnData,
} from '../../../../../../components/modals/interfaces/confirm-delete-dialog.interface';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../../../../../components/modals/interfaces/confirm-dialog.interface';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../../../../../../components/modals/interfaces/entity-properties-dialog.interface';
import { DialogService } from '../../../../../../components/modals/services/dialog.service';
import { BaseViewComponent } from '../base-view.component';
import { TableRow } from './table-row';

@Component({
  selector: 'app-table-view',
  styleUrls: ['table-view.component.scss'],
  templateUrl: './table-view.component.html',
  providers: [{ provide: BaseViewComponent, useExisting: forwardRef(() => TableViewComponent) }],
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
export class TableViewComponent extends BaseViewComponent implements AfterViewInit, OnDestroy {
  private dialogService = inject(DialogService);
  private appNavigation = inject(AppNavigationService);
  private ldapLoader = inject(LdapEntryLoader);
  private bulkService = inject<BulkService<LdapEntryNode>>(BulkService);
  private windows = inject(AppWindowsService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private api = inject(MultidirectoryApiService);
  private getAccessorStrategy = inject(GetAccessorStrategy);
  private completeUpdateEntiresStrategy = inject(CompleteUpdateEntiresStrategies);
  private _dn = '';
  readonly grid = viewChild.required<DatagridComponent>('grid');
  readonly iconColumn = viewChild.required<TemplateRef<HTMLElement>>('iconTemplate');
  page = new Page();
  columns: TableColumn[] = [];
  rows: TableRow[] = [];
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

  get searchQuery() {
    return this._searchQuery;
  }

  @Input() set searchQuery(q: string) {
    this._searchQuery = q;
    this.updateContent();
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

  set accountEnabledToggle(enabled: boolean) {
    this._accountEnabledToggle = enabled;
  }

  ngAfterViewInit(): void {
    const pageSize = localStorage.getItem('gridSize_table-view');
    if (pageSize && !isNaN(parseFloat(pageSize))) {
      this.page.size = Math.floor(parseFloat(pageSize));
    }
    this.columns = [
      {
        name: translate('table-view.name-column'),
        cellTemplate: this.iconColumn(),
        flexGrow: 1,
        checkboxable: true,
        comparator: (
          valueA: TableRow,
          valueB: TableRow,
          rowA: TableRow,
          rowB: TableRow,
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
            ({
              icon: node.icon,
              name: node.name,
              type: node.entry ? EntityInfoResolver.resolveTypeName(node.type) : '',
              entry: node,
              description: node.entry ? EntityInfoResolver.getNodeDescription(node) : '',
              status: node.entry ? EntityInfoResolver.getNodeStatus(node) : '',
            }) as TableRow,
        );
        const grid = this.grid();
        grid.page.totalElements = this.rows.length;
        this.rows = this.rows.slice(
          this.page.pageOffset * this.page.size,
          this.page.pageOffset * this.page.size + this.page.size,
        );

        if (grid.selected?.length > 0) {
          const selected = grid.selected.map((x) => x.entry.id);
          grid.selected = [];
          this.rows.forEach((row) => {
            if (selected.includes(row.entry.id)) {
              this.grid().selected.push(row);
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
    return this.grid().selected.map((x) => x.entry);
  }

  override setSelected(selected: LdapEntryNode[]) {
    if (!this.rows || this.rows.length == 0 || !selected) {
      return;
    }
    this.grid().selected = this.rows.filter(
      (x) => selected.findIndex((y) => y.id == x.entry.id) > -1,
    );
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
            width: '600px',
            minHeight: '660px',
            data: { entity: entry },
          },
        })
        .closed.pipe(take(1))
        .subscribe(() => {
          this.updateContentInner(this.route.snapshot.queryParams['distinguishedName']);
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
        this.appNavigation.reload();
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
      .subscribe(() => this.updateContent());
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
    this.appNavigation.goTo(dn).then((node) => {
      if (!node) {
        return;
      }
      this.appNavigation.navigate(node);
      this.cdr.detectChanges();
    });
  }
}
