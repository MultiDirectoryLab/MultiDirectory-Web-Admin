import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { PropertyTypeResolver } from '@core/ldap/property-type-resolver';
import { SearchQueries } from '@core/ldap/search';
import { translate } from '@jsverse/transloco';
import { AttributeFilter } from '@models/entity-attribute/attribute-filter';
import { EntityAttribute } from '@models/entity-attribute/entity-attribute';
import { SearchResponse } from '@models/entry/search-response';
import { LdapPropertiesService } from '@services/ldap-properties.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DatagridComponent, ModalInjectDirective, Page } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.scss'],
})
export class EntityAttributesComponent implements AfterViewInit {
  @ViewChild('propGrid', { static: true }) propGrid: DatagridComponent | null = null;
  @ViewChild('propertyEditor', { static: true }) attributeEditor!: ModalInjectDirective;

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
    private api: MultidirectoryApiService,
    private cdr: ChangeDetectorRef,
    private properties: LdapPropertiesService,
    private toastr: ToastrService,
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

  // Load attributes for the current entity
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

  private getPage(result: EntityAttribute[]): EntityAttribute[] {
    const start = 0;
    const end = this.page.pageOffset * this.page.size + 2 * this.page.size;
    return result.slice(start, end);
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
    this.accessor[attribute.name] = [];
    attribute.changed = true;

    this.rows = this.rows.filter((x) => x.name !== attribute.name);

    this.cdr.detectChanges();
    this.onFilterChange();
  }

  onEditClick(attributeName = '') {
    const attribute = this.getAttributeForEdit(attributeName);
    if (!attribute || !attribute.writable) return;

    this.api
      .search(SearchQueries.getSchema())
      .pipe(take(1))
      .subscribe({
        next: (schema) => this.handleSchemaResponse(schema, attribute),
        error: () => this.toastr.error(translate('entity-attributes.unable-retrieve-schema')),
      });
  }

  private getAttributeForEdit(attributeName: string): EntityAttribute | null {
    if (attributeName) {
      return new EntityAttribute(attributeName, '');
    }
    if (this.propGrid?.selected?.[0]) {
      return this.propGrid.selected[0];
    }
    this.toastr.error(translate('entity-attributes.select-attribute'));
    return null;
  }

  private handleSchemaResponse(schema: SearchResponse, attribute: EntityAttribute) {
    const attributeTypes = schema.search_result?.[0]?.partial_attributes.find(
      (x) => x.type == 'attributeTypes',
    )?.vals;
    if (!attributeTypes) {
      this.toastr.error(translate('entity-attributes.unable-retrieve-schema'));
      return;
    }

    const syntax = this.extractSyntax(attributeTypes, attribute.name);

    const propertyDescription =
      PropertyTypeResolver.getPropertyDescription(syntax) || PropertyTypeResolver.getDefault();
    this.editAttribute(attribute, propertyDescription);
    return;
  }

  private extractSyntax(attributeTypes: string[], attributeName: string): string | null {
    const description = attributeTypes.find((type) => type.includes(`NAME '${attributeName}`));
    const match = /SYNTAX '([\d+.]+)'/gi.exec(description || '');
    return match ? match[1] : null;
  }

  private editAttribute(attribute: EntityAttribute, propertyDescription: any) {
    const indx = this.findAttributeIndex(attribute.name);
    const addNew = indx === -1;

    if (addNew) {
      this.rows.push(attribute);
    }

    let value: any = attribute.val;
    if (propertyDescription.isArray && !Array.isArray(value)) {
      value = this.getAttributeValues(attribute.name);
    }

    this.openAttributeEditor(attribute, propertyDescription, value, indx, addNew);
  }

  private findAttributeIndex(attributeName: string): number {
    return this.rows.findIndex((attr) => attr.name === attributeName);
  }

  private getAttributeValues(attributeName: string): any[] {
    return this.rows.filter((attr) => attr.name === attributeName).map((attr) => attr.val);
  }

  private openAttributeEditor(
    attribute: EntityAttribute,
    propertyDescription: any,
    value: any,
    indx: number,
    addNew: boolean,
  ) {
    this.attributeEditor
      .open(
        {},
        {
          propertyType: propertyDescription.type,
          propertyName: attribute.name,
          propertyValue: value,
        },
      )
      .pipe(take(1))
      .subscribe((editedValue) => {
        if (!editedValue) return;

        this.updateAttribute(attribute, propertyDescription, editedValue, indx, addNew);
        this.cdr.detectChanges();
      });
  }

  private updateAttribute(
    attribute: EntityAttribute,
    propertyDescription: any,
    editedValue: any,
    indx: number,
    addNew: boolean,
  ) {
    if (addNew) {
      indx = this.rows.push(attribute) - 1;
    }
    this.accessor[attribute.name] = editedValue;
    attribute.changed = true;

    if (propertyDescription.isArray && Array.isArray(editedValue)) {
      this.rows = this.rows.filter((attr) => attr.name !== attribute.name);
      const newValues = editedValue.map(
        (val: string) => new EntityAttribute(attribute.name, val, true),
      );
      this.rows.splice(indx, 0, ...newValues);
    } else {
      this.rows[indx].val = editedValue;
    }
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
