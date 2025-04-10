import { NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { IconViewComponent } from '@features/ldap-browser/components/catalog-content/views/icon-view/icon-view.component';
import { TableViewComponent } from '@features/ldap-browser/components/catalog-content/views/table-view/table-view.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DeleteEntryRequest } from '@models/entry/delete-request';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppWindowsService } from '@services/app-windows.service';
import { ContentViewService } from '@services/content-view.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import {
  ButtonComponent,
  DropdownContainerDirective,
  DropdownMenuComponent,
  MdModalComponent,
  ModalInjectDirective,
  PlaneButtonComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { concat, Subject, take, takeUntil } from 'rxjs';
import { ViewMode } from './view-modes';
import { BaseViewComponent, RightClickEvent } from './views/base-view.component';

@Component({
  selector: 'app-catalog-content',
  templateUrl: './catalog-content.component.html',
  styleUrls: ['./catalog-content.component.scss'],
  imports: [
    PlaneButtonComponent,
    DropdownContainerDirective,
    ButtonComponent,
    TranslocoPipe,
    TextboxComponent,
    NgStyle,
    TableViewComponent,
    IconViewComponent,
    DropdownMenuComponent,
    MdModalComponent,
    FormsModule,
  ],
})
export class CatalogContentComponent implements OnInit, OnDestroy {
  private navigation = inject(AppNavigationService);
  private cdr = inject(ChangeDetectorRef);
  private contentView = inject(ContentViewService);
  private windows = inject(AppWindowsService);
  private api = inject(MultidirectoryApiService);
  private contextMenu = inject(ContextMenuService);
  private hotkeysService = inject(HotkeysService);
  private activatedRoute = inject(ActivatedRoute);
  private _selectedRows: LdapEntryNode[] = [];
  readonly properties = viewChild<ModalInjectDirective>('properties');
  readonly view = viewChild(BaseViewComponent);
  unsubscribe = new Subject<void>();
  LdapEntryType = LdapEntryType;
  ViewMode = ViewMode;
  currentView = this.contentView.contentView;
  searchQuery = '';

  ngOnInit(): void {
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+a',
        (event: KeyboardEvent): boolean => {
          this.openCreateUser();
          return false;
        },
        undefined,
        translate('hotkeys.create-user'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+g',
        (event: KeyboardEvent): boolean => {
          this.openCreateGroup();
          return false;
        },
        undefined,
        translate('hotkeys.create-group'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+u',
        (event: KeyboardEvent): boolean => {
          this.openCreateOu();
          return false;
        },
        undefined,
        translate('hotkeys.create-ou'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+l',
        (event: KeyboardEvent): boolean => {
          return false;
        },
        undefined,
        translate('hotkeys.access-control'),
      ),
    );

    this.navigation.navigationRx.pipe(takeUntil(this.unsubscribe)).subscribe((e) => {
      this.searchQuery = '';
      this.view()?.updateContent();
      this.cdr.detectChanges();
    });

    this.contentView.contentViewRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.currentView = x;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  deleteSelectedEntry() {
    concat(
      ...this._selectedRows.map((x) =>
        this.api.delete(
          new DeleteEntryRequest({
            entry: (<any>x.entry).object_name,
          }),
        ),
      ),
    ).subscribe((x) => {
      this.view()?.updateContent();
    });
  }

  showEntryProperties() {
    this.windows
      .openEntityProperiesModal(this._selectedRows[0])
      .pipe(take(1))
      .subscribe((x) => {
        this.view()?.updateContent();
      });
  }

  showChangePassword() {
    //this.ldapWindows.openChangePasswordModal(this.navigation.selectedEntity[0]);
  }

  openCreateUser() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateUser(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.view()?.updateContent();
      });
  }

  openCreateGroup() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateGroup(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.view()?.updateContent();
      });
  }

  openCreateOu() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateOu(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.navigation.reload();
      });
  }

  openCreateRule() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateRule(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.navigation.reload();
      });
  }

  openCreateComputer() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateComputer(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.navigation.reload();
      });
  }

  openCreateCatalog() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateCatalog(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.navigation.reload();
      });
  }

  showContextMenu(event: RightClickEvent) {
    this.contextMenu.showContextMenuOnNode(
      event.pointerEvent.x,
      event.pointerEvent.y,
      event.selected,
    );
  }
}
