import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { EntityType } from '@core/entities/entities-type';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { SearchQueries } from '@core/ldap/search';
import { AddPrincipalDialogComponent } from '@features/forms/add-principal-dialog/add-principal-dialog.component';
import { CatalogCreateComponent } from '@features/forms/catalog-create/catalog-create.component';
import { CatalogSelectorComponent } from '@features/forms/catalog-selector/catalog-selector.component';
import { ComputerCreateComponent } from '@features/forms/computer-create/computer-create.component';
import { ConfirmDialogComponent } from '@features/forms/confirm-dialog/confirm-dialog.component';
import { DnsRulesDialogComponent } from '@features/forms/dns-rule/dns-rule-dialog.component';
import { DnsSetupDialogComponent } from '@features/forms/dns-setup/dns-setup-dialog.component';
import { EntitySelectorSettings } from '@features/forms/entity-selector/entity-selector-settings.component';
import { EntitySelectorComponent } from '@features/forms/entity-selector/entity-selector.component';
import { EntityTypeSelectorComponent } from '@features/forms/entity-type-selector/entity-type-selector.component';
import { GroupCreateComponent } from '@features/forms/group-create/group-create.component';
import { ModifyDnComponent } from '@features/forms/modify-dn/modify-dn.component';
import { MoveEntityDialogComponent } from '@features/forms/move-entity/move-entity.component';
import { OuCreateComponent } from '@features/forms/ou-create/ou-create.component';
import { RuleCreateComponent } from '@features/forms/rule-create/rule-create.component';
import { SetupKerberosDialogComponent } from '@features/forms/setup-kerberos/setup-kerberos.component';
import { UserCreateComponent } from '@features/forms/user-create/user-create.component';
import { ChangePasswordComponent } from '@features/ldap-browser/components/editors/change-password/change-password.component';
import { PropertyEditorComponent } from '@features/ldap-browser/components/editors/property-editors/property-editor.component';
import { EntityPropertiesComponent } from '@features/ldap-properties/properties.component';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { EditPropertyRequest } from '@models/entity-attribute/edit-property-request';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-windows',
  styleUrls: ['./windows.component.scss'],
  templateUrl: './windows.component.html',
  imports: [
    ModalInjectDirective,
    EntityPropertiesComponent,
    ChangePasswordComponent,
    UserCreateComponent,
    OuCreateComponent,
    RuleCreateComponent,
    CatalogCreateComponent,
    GroupCreateComponent,
    ComputerCreateComponent,
    DeleteConfirmationModalComponent,
    ModifyDnComponent,
    EntityTypeSelectorComponent,
    EntitySelectorComponent,
    CatalogSelectorComponent,
    MoveEntityDialogComponent,
    ConfirmDialogComponent,
    AddPrincipalDialogComponent,
    SetupKerberosDialogComponent,
    DnsRulesDialogComponent,
    DnsSetupDialogComponent,
    PropertyEditorComponent,
  ],
})
export class WindowsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('createUserModal', { static: true }) createUserModal!: ModalInjectDirective;
  @ViewChild('createGroupModal', { static: true }) createGroupModal!: ModalInjectDirective;
  @ViewChild('createOuModal', { static: true }) createOuModal!: ModalInjectDirective;
  @ViewChild('createRuleModal', { static: true }) createRuleModal!: ModalInjectDirective;
  @ViewChild('createComputerModal', { static: true }) createComputerModal!: ModalInjectDirective;
  @ViewChild('createCatalogModal', { static: true }) createCatalogModal!: ModalInjectDirective;
  @ViewChild('properties') properties!: ModalInjectDirective;
  @ViewChild('changePasswordModal') changePasswordModal!: ModalInjectDirective;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: ModalInjectDirective;
  @ViewChild('modifyDnModal') modifyDnModal!: ModalInjectDirective;
  @ViewChild('entityTypeSelectorModal') entityTypeSelectorModal!: ModalInjectDirective;
  @ViewChild('entitySelectorModal') entitySelectorModal!: ModalInjectDirective;
  @ViewChild('catalogSelectorModal') catalogSelectorModal!: ModalInjectDirective;
  @ViewChild('moveEntityDialog') moveEntityDialog!: ModalInjectDirective;
  @ViewChild('confirmDialog') confirmDialog!: ModalInjectDirective;
  @ViewChild('addPrincipalDialog') addPrincipalDialog!: ModalInjectDirective;
  @ViewChild('setupKerberosDialog') setupKerberosDialog!: ModalInjectDirective;
  @ViewChild('dnsRuleDialog') dnsRuleDialog!: ModalInjectDirective;
  @ViewChild('dnsSetupDialog') dnsSetupDialog!: ModalInjectDirective;
  @ViewChild('propertyEditor', { static: true }) attributeEditor!: ModalInjectDirective;

  private unsubscribe = new Subject<void>();

  constructor(
    private ldapWindows: AppWindowsService,
    private attributeService: AttributeService,
    private app: AppSettingsService,
    private api: MultidirectoryApiService,
  ) {}

  ngAfterViewInit(): void {
    this.ldapWindows.openEntityPropertiesModalRx
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((x) => this.openEntityProperties(x)),
      )
      .subscribe((x) => {
        this.ldapWindows.closeEntityPropertiesModal(x);
      });

    this.ldapWindows.openChangePasswordModalRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.openChangePassword(x);
    });

    this.ldapWindows.showCreateUserMenuRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((parentDn) => {
        this.openCreateUser(parentDn);
      });

    this.ldapWindows.showCreateGroupMenuRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((parentDn) => {
        this.openCreateGroup(parentDn);
      });

    this.ldapWindows.showCreateOuMenuRx.pipe(takeUntil(this.unsubscribe)).subscribe((parentDn) => {
      this.openCreateOu(parentDn);
    });

    this.ldapWindows.showCreateRuleMenuRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((parentDn) => {
        this.openCreateRule(parentDn);
      });

    this.ldapWindows.showCreateCatalogRx.pipe(takeUntil(this.unsubscribe)).subscribe((parentDn) => {
      this.openCreateCatalog(parentDn);
    });

    this.ldapWindows.showCreateComputerMenuRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((parentDn) => {
        this.openCreateComputer(parentDn);
      });

    this.ldapWindows.showDeleteEntryConfirmationRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((toDeleteDNs) => {
        this.openDeleteRowsConfirmation(toDeleteDNs);
      });

    this.ldapWindows.showModifyDnRx.pipe(takeUntil(this.unsubscribe)).subscribe((toModifyDn) => {
      this.openModifyDn(toModifyDn);
    });

    this.ldapWindows.showEntityTypeSelectorRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.openEntityTypeSelector(x);
    });

    this.ldapWindows.showEntitySelectorRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((selected) => {
        this.openEntitySelector(selected);
      });

    this.ldapWindows.showCatalogSelectorRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((selected) => {
        this.openCatalogSelector(selected);
      });

    this.ldapWindows.showCopyEntityDialogRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((selected) => {
        this.openCopyEntityDialog(selected);
      });

    this.ldapWindows.showConfirmDialogRx.pipe(takeUntil(this.unsubscribe)).subscribe((prompt) => {
      this.openConfirmDialog(prompt);
    });

    this.ldapWindows.showAddPrincipalDialogRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.openAddPrincipalDialog();
    });

    this.ldapWindows.showSetupKerberosDialogRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.openSetupKerberosDialog();
    });

    this.ldapWindows.showDnsRuleDialogRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ rule, editMode }) => {
        this.openDnsRuleDialog(rule, editMode);
      });

    this.ldapWindows.showDnsSetupDialogRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((dnsSetupRequest) => {
        this.openDnsSetupDialog(dnsSetupRequest);
      });

    this.ldapWindows.showPropertyEditorDialogRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((editPropertyRequest) => {
        this.openEditPropertyDialog(editPropertyRequest);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openEntityProperties(entity: LdapEntryNode): Observable<LdapEntryNode> {
    return this.api
      .search(SearchQueries.getProperites(entity.id))
      .pipe(
        switchMap((props) => {
          const attributes = props.search_result[0].partial_attributes;
          const accessor = this.attributeService.getTrackableAttributes(
            entity,
            new LdapAttributes(attributes),
          );
          return this.properties.open(
            { width: '600px', minHeight: 660 },
            { accessor: accessor, entityType: entity.type },
          );
        }),
      )
      .pipe(take(1));
  }

  openAccountSettings() {
    if (!this.app.userEntry) {
      return;
    }
    this.openEntityProperties(this.app.userEntry);
  }

  openChangePassword(entity: LdapEntryNode | undefined = undefined) {
    if (!entity) {
      if (!this.app.userEntry) {
        return;
      }
      entity = this.app.userEntry;
    }
    this.changePasswordModal
      ?.open(
        { minHeight: 220 },
        {
          identity: entity.id,
          un: entity.name,
        },
      )
      .pipe(take(1))
      .subscribe((x) => {});
  }

  openCreateUser(parentDn: string) {
    this.createUserModal
      .open({ width: '580px', minHeight: 564 }, { parentDn: parentDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeCreateUser(parentDn);
      });
  }

  openCreateGroup(parentDn: string) {
    this.createGroupModal
      .open({ width: '580px', minHeight: 485 }, { parentDn: parentDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeCreateGroup(parentDn);
      });
  }

  openCreateOu(parentDn: string) {
    this.createOuModal
      .open({ width: '580px', minHeight: 485 }, { parentDn: parentDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeCreateOu(parentDn);
      });
  }

  openCreateRule(parentDn: string) {
    this.createRuleModal
      .open({ width: '580px', minHeight: 485 }, { parentDn: parentDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeCreateRule(parentDn);
      });
  }

  openCreateCatalog(parentDn: string) {
    this.createCatalogModal
      .open({ width: '580px', minHeight: 485 }, { parentDn: parentDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeCreateCatalog(parentDn);
      });
  }

  openCreateComputer(parentDn: string) {
    this.createComputerModal
      .open({ width: '580px', minHeight: 525 }, { parentDn: parentDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeCreateComputer(x);
      });
  }

  openDeleteRowsConfirmation(toDeleteDNs: string[]) {
    this.deleteConfirmationModal
      .open({ width: '580px' }, { toDeleteDNs: toDeleteDNs })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeDeleteEntryConfirmation(x);
      });
  }

  openModifyDn(toModifyDn: string) {
    this.modifyDnModal
      .open({ width: '580px' }, { toModifyDn: toModifyDn })
      .pipe(take(1))
      .subscribe((x) => {
        this.ldapWindows.closeModifyDn(x);
      });
  }

  openEntityTypeSelector(selectedEntityTypes: EntityType[] = []) {
    this.entityTypeSelectorModal
      .open({ width: '580px', minHeight: 360 }, { selectedEntityTypes: selectedEntityTypes })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeEntityTypeSelector(result);
      });
  }

  openEntitySelector(settings: EntitySelectorSettings) {
    this.entitySelectorModal
      .open({ minHeight: 360 }, { settings: settings })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeEntitySelector(result);
      });
  }

  openCatalogSelector(selectedCatalog: LdapEntryNode[] = []) {
    this.catalogSelectorModal
      .open({ minHeight: 360 })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeCatalogSelector(result);
      });
  }

  openCopyEntityDialog(entities: LdapEntryNode[]) {
    this.moveEntityDialog
      .open({ minHeight: 230 }, { toMove: entities })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeCopyEntityDialog(result);
      });
  }

  openConfirmDialog(prompt: ConfirmDialogDescriptor) {
    this.confirmDialog
      .open({ minHeight: 160 }, { prompt: prompt })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeConfirmDialog(result);
      });
  }

  openAddPrincipalDialog() {
    this.addPrincipalDialog
      .open({ minHeight: 360 }, {})
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeAddPrincipalDialog();
      });
  }

  openSetupKerberosDialog() {
    this.setupKerberosDialog
      .open({ minHeight: 400 }, {})
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeSetupKerberosDialog();
      });
  }

  openDnsRuleDialog(dnsRule: DnsRule, editMode: boolean = false) {
    this.dnsRuleDialog
      .open({ minHeight: 360 }, { dnsRule: dnsRule, editMode: editMode })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeDnsRuleDialog(result);
      });
  }

  openDnsSetupDialog(dnsSetupRequest: DnsSetupRequest) {
    this.dnsSetupDialog
      .open({ minHeight: 460 }, { dnsSetupRequest: dnsSetupRequest })
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closeDnsSetupDialog(result);
      });
  }

  openEditPropertyDialog(editPropertyRequest: EditPropertyRequest) {
    this.attributeEditor
      .open({}, editPropertyRequest)
      .pipe(take(1))
      .subscribe((result) => {
        this.ldapWindows.closePropertyEditorDialog(result);
      });
  }
}
