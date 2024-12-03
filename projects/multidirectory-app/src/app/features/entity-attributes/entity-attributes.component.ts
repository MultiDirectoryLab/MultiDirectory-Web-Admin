import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntityAttributeTypeResolver } from '@core/entity-attributes/entity-attribute-type-resolver';
import { translate } from '@jsverse/transloco';
import { AttributeFilter } from '@models/entity-attribute/attribute-filter';
import { EntityAttribute } from '@models/entity-attribute/entity-attribute';
import { LdapPropertiesService } from '@services/ldap-properties.service';
import { DatagridComponent, Page } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { AppWindowsService } from '@services/app-windows.service';
import { EditPropertyRequest } from '@models/entity-attribute/edit-property-request';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.scss'],
})
export class EntityAttributesComponent implements AfterViewInit {
  @ViewChild('propGrid', { static: true }) propGrid: DatagridComponent | null = null;

  unsubscribe = new Subject<boolean>();
  filter = new AttributeFilter(true);
  rows: any[] = [];
  _searchFilter = '';

  private _schema: EntityAttribute[] = [];
  private _accessor: LdapAttributes = {};
  private _accessorRx = new BehaviorSubject<LdapAttributes>(this._accessor);

  @Input() set accessor(x: LdapAttributes) {
    this._accessor = x;
    this._accessorRx.next(x);
  }
  get accessor(): LdapAttributes {
    return this._accessor;
  }

  page = new Page({ pageNumber: 1, size: 200, totalElements: 4000 });
  propColumns = [
    { name: translate('entity-attributes.name'), prop: 'name', flexGrow: 1 },
    { name: translate('entity-attributes.value'), prop: 'val', flexGrow: 2 },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private properties: LdapPropertiesService,
    private toastr: ToastrService,
    private windows: AppWindowsService,
  ) {}

  ngAfterViewInit(): void {
    this._accessorRx.pipe(takeUntil(this.unsubscribe)).subscribe((_) => {
      this.loadEntityAttributes();
    });
  }

  // Search filter setter and getter
  set searchFilter(value: string) {
    this._searchFilter = value;
  }

  get searchFilter(): string {
    return this._searchFilter;
  }

  private loadEntityAttributes() {
    const entityDn = this.accessor['$entitydn']?.[0];
    if (entityDn) {
      this.properties
        .loadSchema()
        .pipe(take(1))
        .subscribe({
          next: (schema) => {
            this._schema = schema;
            this.displayAttributes();
          },
          error: () => this.toastr.error(translate('entity-attributes.unable-load-data')),
        });
    }
  }

  private displayAttributes() {
    this.rows = [];
    const accessorEntires = Object.keys(this.accessor);
    this._schema.forEach((element) => {
      if (!accessorEntires.includes(element.name)) {
        this.rows.push({
          name: element.name,
          val: element.val,
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

  // Filter data based on the current filter settings and search query
  private filterData(result: EntityAttribute[]): EntityAttribute[] {
    return result
      .filter((attr) => !this.filter.showWithValuesOnly || attr.val)
      .filter((attr) => !this.filter.showWritableOnly || attr.writable)
      .filter(
        (attr) =>
          !this._searchFilter ||
          attr.name.toLocaleLowerCase().includes(this._searchFilter.toLocaleLowerCase()),
      );
  }

  onDeleteClick() {
    if (!this.propGrid?.selected?.[0]) {
      this.toastr.error(translate('entity-attributes.select-attribute'));
      return;
    }

    const attribute = this.propGrid.selected[0];
    this.deleteAttribute(attribute);
  }

  private deleteAttribute(attribute: EntityAttribute) {
    attribute.changed = true;
    this.accessor[attribute.name] = this.accessor[attribute.name].filter(
      (x) => x !== attribute.val,
    );
    this.rows = this.rows.filter((x) => x.name !== attribute.name && x.val !== attribute.val);
    this.cdr.detectChanges();
    this.onFilterChange();
  }

  onEditClick(attributeName = '') {
    attributeName = attributeName || this.propGrid?._selected?.[0]?.name;
    let attribute = this._schema.find((x) => x.name == attributeName);
    if (!attribute || !attribute.writable) {
      attribute = new EntityAttribute(attributeName, '');
    }
    this.openAttributeEditor(attribute);
  }

  private openAttributeEditor(attribute: EntityAttribute) {
    const propertyDescription =
      EntityAttributeTypeResolver.getPropertyDescription(attribute.syntax) ||
      EntityAttributeTypeResolver.getDefault();
    this.windows
      .openPropertyEditorDialog(
        new EditPropertyRequest({
          propertyType: propertyDescription.type,
          propertyName: attribute.name,
          propertyValue: this.accessor[attribute.name],
        }),
      )
      .pipe(take(1))
      .subscribe((editedValue) => {
        if (!editedValue) return;
        this.updateAttribute(attribute, editedValue);
        this.cdr.detectChanges();
      });
  }

  private updateAttribute(attribute: EntityAttribute, editedValue: EditPropertyRequest) {
    this.accessor[attribute.name] = editedValue.propertyValue;
    attribute.changed = true;
    this.loadEntityAttributes();
  }

  onFilterChange() {
    this.page.pageNumber = 1;
    this.loadEntityAttributes();
  }

  onPageChanged(event: Page) {
    this.page = event;
    this.page.size = this.rows.length;
    this.page.totalElements = this.rows.length;
    this.cdr.detectChanges();
  }
}
