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
import { TableColumn } from '@swimlane/ngx-datatable';
import {
  DatagridComponent,
  DropdownMenuComponent,
  DropdownOption,
  Page,
  Treenode,
} from 'multidirectory-ui-kit';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { Subject, take } from 'rxjs';
import { TableRow } from './table-row';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { translate } from '@ngneat/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { AppNavigationService, NavigationEvent } from '@services/app-navigation.service';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BaseViewComponent } from '../base-view.component';

@Component({
  selector: 'app-table-view',
  styleUrls: ['table-view.component.scss'],
  templateUrl: './table-view.component.html',
  providers: [{ provide: BaseViewComponent, useExisting: forwardRef(() => TableViewComponent) }],
})
export class TableViewComponent extends BaseViewComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: true }) grid!: DatagridComponent;
  @ViewChild('iconTemplate', { static: true }) iconColumn!: TemplateRef<HTMLElement>;
  private _dn = '';
  page = new Page();
  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  unsubscribe = new Subject<void>();

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
    private windows: AppWindowsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    const pageSize = localStorage.getItem('gridSize_table-view');
    if (pageSize && !isNaN(parseFloat(pageSize))) {
      this.page.size = Math.floor(parseFloat(pageSize));
    }
    this.columns = [
      { name: translate('table-view.name-column'), cellTemplate: this.iconColumn, flexGrow: 1 },
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
      .getContent(dn)
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
}
