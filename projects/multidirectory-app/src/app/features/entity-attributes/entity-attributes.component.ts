import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { translate } from '@jsverse/transloco';
import { AttributeFilter } from '@models/entity-attribute/attribute-filter';
import { SchemaEntry } from '@models/entity-attribute/schema-entry';
import { LdapPropertiesService } from '@services/ldap-properties.service';
import { DatagridComponent, Page } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Subject, take, takeUntil } from 'rxjs';
import { AppWindowsService } from '@services/app-windows.service';
import { EditPropertyRequest } from '@models/entity-attribute/edit-property-request';
import { TableColumn } from 'ngx-datatable-gimefork';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.scss'],
})
export class EntityAttributesComponent implements OnInit {
  @ViewChild('propGrid', { static: true }) propGrid: DatagridComponent | null = null;
  @ViewChild('dataGridCellTemplate', { static: true })
  dataGridCellTemplateRef: TemplateRef<any> | null = null;

  private _unsubscribe = new Subject<boolean>();
  private _schema = new Map<string, SchemaEntry>();
  private _accessor: LdapAttributes = {};
  private _accessorRx = new BehaviorSubject<LdapAttributes>(this._accessor);
  rows: { name: string; val: string }[] = [];

  searchQuery = '';
  filter = new AttributeFilter();

  @Input() set accessor(x: LdapAttributes) {
    this._accessor = x;
    this._accessorRx.next(x);
  }
  get accessor(): LdapAttributes {
    return this._accessor;
  }

  page = new Page({ pageNumber: 1, size: 200, totalElements: 4000 });
  propColumns: TableColumn[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private properties: LdapPropertiesService,
    private toastr: ToastrService,
    private windows: AppWindowsService,
  ) {}

  ngOnInit(): void {
    this._accessorRx.pipe(takeUntil(this._unsubscribe)).subscribe((_) => {
      this.loadEntityAttributes();
    });

    this.propColumns = [
      {
        name: translate('entity-attributes.name'),
        prop: 'name',
        flexGrow: 1,
      },
      {
        name: translate('entity-attributes.value'),
        prop: 'val',
        flexGrow: 2,
        cellTemplate: this.dataGridCellTemplateRef,
      },
    ];
  }

  private loadEntityAttributes() {
    const entityDn = this.accessor['$entitydn']?.[0];
    if (entityDn) {
      this.properties
        .loadSchema()
        .pipe(take(1))
        .subscribe({
          next: (schema) => {
            schema.forEach((x) => {
              this._schema.set(x.name, x);
            });
            this.displayAttributes();
          },
          error: () => this.toastr.error(translate('entity-attributes.unable-load-data')),
        });
    }
  }

  private displayAttributes() {
    this.rows = [];
    const accessorEntires = Object.keys(this.accessor);
    const outOfSchemaEntries = accessorEntires
      .filter((x) => !this._schema.has(x))
      .map(
        (x) =>
          new SchemaEntry({
            name: x,
            writable: true,
          }),
      );

    Array.from(this._schema.values())
      .concat(outOfSchemaEntries)
      .forEach((element) => {
        if (!accessorEntires.includes(element.name)) {
          this.rows.push({
            name: element.name,
            val: '',
          });
        } else {
          this.accessor[element.name].forEach((value) => {
            this.rows.push({
              name: element.name,
              val: value,
            });
          });
        }
      });

    this.rows = this.filterData(Array.from(this.rows));
    this.onPageChanged(this.page);
    this.cdr.detectChanges();
  }

  private filterData(result: { name: string; val: string }[]): { name: string; val: string }[] {
    return result
      .filter((attr) => !this.filter.showWithValuesOnly || this._accessor[attr.name])
      .filter((attr) => !this.filter.showWritableOnly || this._schema.get(attr.name)?.writable)
      .filter(
        (attr) =>
          !this.searchQuery ||
          attr.name.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()),
      );
  }

  onCopyClick(value: string): void {
    from(navigator.clipboard.writeText(value))
      .pipe(take(1))
      .subscribe(() => this.toastr.success(translate('entity-attributes.copied')));
  }

  onDeleteClick() {
    if (!this.propGrid?.selected?.[0]) {
      this.toastr.error(translate('entity-attributes.select-attribute'));
      return;
    }
    const attribute = this.propGrid.selected[0];
    this.accessor[attribute.name] = this.accessor[attribute.name].filter(
      (x) => x !== attribute.val,
    );
    this.rows = this.rows.filter((x) => x.name !== attribute.name || x.val !== attribute.val);
    this.cdr.detectChanges();
  }

  onEditClick(attributeName = '') {
    attributeName = attributeName || this.propGrid?._selected?.[0]?.name;
    let attribute = this._schema.get(attributeName);
    if (!attribute || !attribute.writable) {
      attribute = new SchemaEntry({
        name: attributeName,
      });
    }

    this.windows
      .openPropertyEditorDialog(
        new EditPropertyRequest({
          propertyType: attribute.type,
          propertyName: attribute.name,
          propertyValue: this.accessor[attribute.name],
        }),
      )
      .pipe(take(1))
      .subscribe((editedValue) => {
        if (!editedValue) return;
        this.accessor[attribute.name] = editedValue.propertyValue;
        this.displayAttributes();
      });
  }

  onFilterChange() {
    this.page.pageNumber = 1;
    this.displayAttributes();
  }

  onPageChanged(event: Page) {
    this.page = event;
    this.page.size = this.rows.length;
    this.page.totalElements = this.rows.length;
    this.cdr.detectChanges();
  }
}
