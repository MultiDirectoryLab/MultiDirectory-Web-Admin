import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Input,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  CheckboxComponent,
  DatagridComponent,
  DropdownComponent,
  DropdownContainerDirective,
  DropdownMenuComponent,
  DropdownOption,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Subject, take, takeUntil } from 'rxjs';
import { AttributesFilterContextMenuComponent } from '../../components/modals/components/context-menus/attributes-filter-context-menu/attributes-filter-context-menu.component';
import { PropertyEditDialogComponent } from '../../components/modals/components/dialogs/property-edit-dialog/property-edit-dialog.component';
import {
  PropertyEditDialogData,
  PropertyEditDialogReturnData,
} from '../../components/modals/interfaces/property-edit-dialog.interface';
import { ContextMenuService } from '../../components/modals/services/context-menu.service';
import { DialogService } from '../../components/modals/services/dialog.service';
import { AttributeFilter } from '@models/api/entity-attribute/attribute-filter';
import { EditPropertyRequest } from '@models/api/entity-attribute/edit-property-request';
import { SchemaEntry } from '@models/api/entity-attribute/schema-entry';
import { LdapPropertiesService } from '@services/ldap/ldap-properties.service';
import { T } from 'node_modules/@angular/cdk/portal-directives.d-DbeNrI5D';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.scss'],
  imports: [
    TranslocoPipe,
    TextboxComponent,
    FormsModule,
    ButtonComponent,
    DatagridComponent,
    CheckboxComponent,
    DropdownMenuComponent,
    DropdownContainerDirective,
    NgClass,
  ],
})
export class EntityAttributesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private properties = inject(LdapPropertiesService);
  private toastr = inject(ToastrService);
  private contextMenuService = inject(ContextMenuService);
  private dialogService: DialogService = inject(DialogService);
  private _unsubscribe = new Subject<boolean>();
  private _schema = new Map<string, SchemaEntry>();
  readonly propGrid = viewChild.required(DatagridComponent);
  readonly dataGridCellTemplateRef = viewChild.required<TemplateRef<any>>('dataGridCellTemplate');
  rows: { name: string; val: string }[] = [];
  searchQuery = '';
  filter = signal(new AttributeFilter());
  propColumns: TableColumn[] = [];

  offset = 0;
  total = 0;
  pageSizes: DropdownOption[] = [
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];
  limit = this.pageSizes[0].value;

  private _accessor: LdapAttributes = {};

  private _accessorRx = new BehaviorSubject<LdapAttributes>(this._accessor);

  get accessor(): LdapAttributes {
    return this._accessor;
  }

  @Input() set accessor(x: LdapAttributes) {
    this._accessor = x;
    this._accessorRx.next(x);
  }

  constructor() {
    effect(() => {
      this.onFilterChange();
    });
  }

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
        cellTemplate: this.dataGridCellTemplateRef(),
      },
    ];
  }

  onCopyClick(value: string): void {
    from(navigator.clipboard.writeText(value))
      .pipe(take(1))
      .subscribe(() => this.toastr.success(translate('entity-attributes.copied')));
  }

  onDeleteClick() {
    if (!this.propGrid()?.selected?.[0]) {
      this.toastr.error(translate('entity-attributes.select-attribute'));
      return;
    }
    const attribute = this.propGrid().selected[0];
    this.accessor[attribute.name] = this.accessor[attribute.name].filter(
      (x) => x !== attribute.val,
    );
    this.rows = this.rows.filter((x) => x.name !== attribute.name || x.val !== attribute.val);
    this.cdr.detectChanges();
  }

  onEditClick(attributeName = '') {
    attributeName = attributeName || this.propGrid()?._selected?.[0]?.name;
    let attribute = this._schema.get(attributeName);
    if (!attribute || !attribute.writable) {
      attribute = new SchemaEntry({
        name: attributeName,
      });
    }

    this.dialogService
      .open<PropertyEditDialogReturnData, PropertyEditDialogData, PropertyEditDialogComponent>({
        component: PropertyEditDialogComponent,
        dialogConfig: {
          data: new EditPropertyRequest({
            propertyType: attribute.type,
            propertyName: attribute.name,
            propertyValue: this.accessor[attribute.name],
          }),
        },
      })
      .closed.pipe(take(1))
      .subscribe((editedValue) => {
        if (!editedValue) return;

        this.accessor[attribute.name] = editedValue.propertyValue;
        this.displayAttributes();
      });
  }

  onFilterChange() {
    this.displayAttributes();
  }

  onPageChanged(event: number) {
    this.offset = event;
    this.cdr.detectChanges();
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

    this.offset = 0;
    this.total = this.rows.length;
    this.cdr.detectChanges();
  }

  private filterData(result: { name: string; val: string }[]): { name: string; val: string }[] {
    return result
      .filter((attr) => !this.filter().showWithValuesOnly || this._accessor[attr.name])
      .filter((attr) => !this.filter().showWritableOnly || this._schema.get(attr.name)?.writable)
      .filter(
        (attr) =>
          !this.searchQuery ||
          attr.name.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()),
      );
  }

  public openFilterContext(e: Event) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    const filterContextMenuRef = this.contextMenuService.open<
      { filter: AttributeFilter },
      { filter: WritableSignal<AttributeFilter> },
      AttributesFilterContextMenuComponent
    >({
      component: AttributesFilterContextMenuComponent,
      x: rect.left,
      y: rect.bottom,
      contextMenuConfig: {
        data: { filter: this.filter },
        hasBackdrop: false,
        minWidth: 'auto',
        minHeight: 'auto',
      },
    });

    filterContextMenuRef.closed.subscribe((data) => {
      if (data && data.filter) {
        this.filter.update((filter) => ({ ...filter, ...data.filter }));
        this.onFilterChange();
      }
    });
  }
}
