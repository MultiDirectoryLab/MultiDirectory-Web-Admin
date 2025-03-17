import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { translate } from '@jsverse/transloco';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { DropdownMenuComponent, ModalInjectDirective, Page } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppWindowsService } from '@services/app-windows.service';
import { ContentViewService } from '@services/content-view.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Subject, concat, take, takeUntil } from 'rxjs';
import { ViewMode } from './view-modes';
import { BaseViewComponent, RightClickEvent } from './views/base-view.component';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { ContextMenuService } from '@services/contextmenu.service';
import { ActivatedRoute } from '@angular/router';
import { DeleteEntryRequest } from '@models/entry/delete-request';

@Component({
  selector: 'app-catalog-content',
  templateUrl: './catalog-content.component.html',
  styleUrls: ['./catalog-content.component.scss'],
})
export class CatalogContentComponent implements OnInit, OnDestroy {
  @ViewChild('properties', { static: true }) properties?: ModalInjectDirective;
  @ViewChild(BaseViewComponent) view?: BaseViewComponent;
  private _selectedRows: LdapEntryNode[] = [];
  unsubscribe = new Subject<void>();
  LdapEntryType = LdapEntryType;
  ViewMode = ViewMode;
  currentView = this.contentView.contentView;
  searchQuery = '';

  constructor(
    private navigation: AppNavigationService,
    private cdr: ChangeDetectorRef,
    private contentView: ContentViewService,
    private windows: AppWindowsService,
    private api: MultidirectoryApiService,
    private contextMenu: ContextMenuService,
    private hotkeysService: HotkeysService,
    private activatedRoute: ActivatedRoute,
  ) {}

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
    //   concat(
    //     ...this._selectedRows.map((x) =>
    //       this.api.delete(
    //         new DeleteEntryRequest({
    //           entry: (<any>x.entry).object_name,
    //         }),
    //       ),
    //     ),
    //   ).subscribe((x) => {
    //     this.view?.updateContent();
    //   });
  }

  showEntryProperties() {
    this.windows
      .openEntityProperiesModal(this._selectedRows[0])
      .pipe(take(1))
      .subscribe((x) => {
        this.view?.updateContent();
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
        this.view?.updateContent();
      });
  }

  openCreateGroup() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateGroup(dn)
      .pipe(take(1))
      .subscribe((x) => {
        this.view?.updateContent();
      });
  }

  openCreateOu() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateOu(dn)
      .pipe(take(1))
      .subscribe((x) => {});
  }

  openCreateRule() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateRule(dn)
      .pipe(take(1))
      .subscribe((x) => {});
  }

  openCreateComputer() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateComputer(dn)
      .pipe(take(1))
      .subscribe((x) => {});
  }

  openCreateCatalog() {
    const dn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
    this.windows
      .openCreateCatalog(dn)
      .pipe(take(1))
      .subscribe((x) => {});
  }

  showContextMenu(event: RightClickEvent) {
    this.contextMenu.showContextMenuOnNode(
      event.pointerEvent.x,
      event.pointerEvent.y,
      event.selected,
    );
  }
}
