import { DialogRef } from '@angular/cdk/dialog';
import { NgStyle } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ContextMenuComponent } from '@components/modals/components/core/context-menu/context-menu.component';
import { CreateCatalogDialogComponent } from '@components/modals/components/dialogs/create-catalog-dialog/create-catalog-dialog.component';
import { CreateComputerDialogComponent } from '@components/modals/components/dialogs/create-computer-dialog/create-computer-dialog.component';
import { CreateGroupDialogComponent } from '@components/modals/components/dialogs/create-group-dialog/create-group-dialog.component';
import { CreateOrganizationUnitDialogComponent } from '@components/modals/components/dialogs/create-organization-unit-dialog/create-organization-unit-dialog.component';
import { CreateRuleDialogComponent } from '@components/modals/components/dialogs/create-rule-dialog/create-rule-dialog.component';
import { CreateUserDialogComponent } from '@components/modals/components/dialogs/create-user-dialog/create-user-dialog.component';
import { ContextMenuData } from '@components/modals/interfaces/context-menu-dialog.interface';
import {
  CreateCatalogDialogData,
  CreateCatalogDialogReturnData,
} from '@components/modals/interfaces/create-catalog-dialog.interface';
import {
  CreateComputerDialogData,
  CreateComputerDialogReturnData,
} from '@components/modals/interfaces/create-computer-dialog.interface';
import {
  CreateGroupDialogData,
  CreateGroupDialogReturnData,
} from '@components/modals/interfaces/create-group-dialog.interface';
import {
  CreateOrganizationUnitDialogData,
  CreateOrganizationUnitDialogReturnData,
} from '@components/modals/interfaces/create-organization-unit-dialog.interface';
import {
  CreateRuleDialogData,
  CreateRuleDialogReturnData,
} from '@components/modals/interfaces/create-rule-dialog.interface';
import {
  CreateUserDialogData,
  CreateUserDialogReturnData,
} from '@components/modals/interfaces/user-create-dialog.interface';
import { ContextMenuService } from '@components/modals/services/context-menu.service';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { ContentViewService } from '@services/content-view.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import {
  ButtonComponent,
  DropdownContainerDirective,
  DropdownMenuComponent,
  ModalInjectDirective,
  PlaneButtonComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { delay, take, tap } from 'rxjs';
import { ViewMode } from './view-modes';
import { IconViewComponent } from './views/icon-view/icon-view.component';
import { TableViewComponent } from './views/table-view/table-view.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalog-content',
  templateUrl: './catalog-content.component.html',
  styleUrls: ['./catalog-content.component.scss'],
  imports: [
    RouterModule,
    PlaneButtonComponent,
    DropdownContainerDirective,
    ButtonComponent,
    TranslocoPipe,
    TextboxComponent,
    NgStyle,
    TableViewComponent,
    IconViewComponent,
    DropdownMenuComponent,
    FormsModule,
  ],
})
export class CatalogContentComponent implements OnInit, OnDestroy {
  readonly properties = viewChild<ModalInjectDirective>('properties');

  public ViewMode = ViewMode;
  public searchQuery = '';

  private contextMenuService: ContextMenuService = inject(ContextMenuService);
  private dialogService: DialogService = inject(DialogService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private contentView: ContentViewService = inject(ContentViewService);
  private hotkeysService: HotkeysService = inject(HotkeysService);
  private destroyRef$ = inject(DestroyRef);
  private navigation = inject(AppNavigationService);
  private ldapTreeviewService = inject(LdapTreeviewService);

  public currentView = this.contentView.contentView;

  public ngOnInit(): void {
    let createUserDialogRef: DialogRef<
      CreateUserDialogReturnData,
      CreateUserDialogComponent
    > | null = null;

    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+a', 'meta+a'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();

          if (!createUserDialogRef) {
            createUserDialogRef = this.openCreateUser();

            createUserDialogRef.closed.pipe(take(1)).subscribe(() => {
              createUserDialogRef = null;
            });
          }
          return false;
          1;
        },
        undefined,
        translate('hotkeys.create-user'),
      ),
    );

    let createGroupDialogRef: DialogRef<
      CreateGroupDialogReturnData,
      CreateGroupDialogComponent
    > | null = null;

    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+g', 'meta+g'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();

          if (!createGroupDialogRef) {
            createGroupDialogRef = this.openCreateGroup();

            createGroupDialogRef.closed.pipe(take(1)).subscribe(() => {
              createGroupDialogRef = null;
            });
          }
          return false;
        },
        undefined,
        translate('hotkeys.create-group'),
      ),
    );

    let createOrganizationUnitDialogRef: DialogRef<
      CreateOrganizationUnitDialogReturnData,
      CreateOrganizationUnitDialogComponent
    > | null = null;

    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+u', 'meta+u'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();

          if (!createOrganizationUnitDialogRef) {
            createOrganizationUnitDialogRef = this.openCreateOu();

            createOrganizationUnitDialogRef.closed.pipe(take(1)).subscribe(() => {
              createOrganizationUnitDialogRef = null;
            });
          }
          return false;
        },
        undefined,
        translate('hotkeys.create-ou'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+l', 'meta+l'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },
        undefined,
        translate('hotkeys.access-control'),
      ),
    );

    this.contentView.contentViewRx.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.currentView = x;
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.hotkeysService.reset();
  }

  public openCreateGroup(): DialogRef<CreateGroupDialogReturnData, CreateGroupDialogComponent> {
    const parentDn = this.navigation.snapshot.queryParams['distinguishedName'];

    const dialogRef = this.dialogService.open<
      CreateGroupDialogReturnData,
      CreateGroupDialogData,
      CreateGroupDialogComponent
    >({
      component: CreateGroupDialogComponent,
      dialogConfig: {
        data: { parentDn },
        width: '580px',
        minHeight: '485px',
      },
    });

    dialogRef.closed.pipe(take(1)).subscribe(() => {
      this.navigation.reload();
    });

    return dialogRef;
  }

  public openCreateOu(): DialogRef<
    CreateOrganizationUnitDialogReturnData,
    CreateOrganizationUnitDialogComponent
  > {
    const parentDn = this.navigation.snapshot.queryParams['distinguishedName'];

    const dialogRef = this.dialogService.open<
      CreateOrganizationUnitDialogReturnData,
      CreateOrganizationUnitDialogData,
      CreateOrganizationUnitDialogComponent
    >({
      component: CreateOrganizationUnitDialogComponent,
      dialogConfig: {
        width: '580px',
        minHeight: '485px',
        data: { parentDn },
      },
    });

    dialogRef.closed.pipe(take(1)).subscribe(() => {
      this.navigation.reload();
    });

    return dialogRef;
  }

  public openCreateRule() {
    const parentDn = this.navigation.snapshot.queryParams['distinguishedName'];

    this.dialogService
      .open<CreateRuleDialogReturnData, CreateRuleDialogData, CreateRuleDialogComponent>({
        component: CreateRuleDialogComponent,
        dialogConfig: {
          width: '580px',
          minHeight: '485px',
          data: { parentDn },
        },
      })
      .closed.pipe(take(1))
      .subscribe(() => {
        this.navigation.reload();
      });
  }

  public openCreateComputer() {
    const parentDn = this.navigation.snapshot.queryParams['distinguishedName'];

    this.dialogService
      .open<
        CreateComputerDialogReturnData,
        CreateComputerDialogData,
        CreateComputerDialogComponent
      >({
        component: CreateComputerDialogComponent,
        dialogConfig: {
          width: '580px',
          minHeight: '525px',
          data: { parentDn },
        },
      })
      .closed.pipe()
      .subscribe(() => {
        this.navigation.reload();
      });
  }

  public openCreateCatalog() {
    const parentDn = this.navigation.snapshot.queryParams['distinguishedName'];

    this.dialogService
      .open<CreateCatalogDialogReturnData, CreateCatalogDialogData, CreateCatalogDialogComponent>({
        component: CreateCatalogDialogComponent,
        dialogConfig: {
          width: '580px',
          minHeight: '485px',
          data: { parentDn },
        },
      })
      .closed.pipe(delay(1000))
      .subscribe(() => {
        {
          this.navigation.reload();
        }
      });
  }

  public openCreateUser(): DialogRef<CreateUserDialogReturnData, CreateUserDialogComponent> {
    const dn = this.navigation.snapshot.queryParams['distinguishedName'];

    const dialogRef = this.dialogService.open<
      CreateUserDialogReturnData,
      CreateUserDialogData,
      CreateUserDialogComponent
    >({
      component: CreateUserDialogComponent,
      dialogConfig: {
        data: { dn },
        width: '580px',
        height: '564px',
      },
    });

    dialogRef.closed.subscribe(() => {
      this.navigation.reload();
    });

    return dialogRef;
  }

  public showContextMenu({ selected, pointerEvent: { x, y } }: any) {
    const data: ContextMenuData = {
      entity: selected,
    };

    this.contextMenuService
      .open({
        component: ContextMenuComponent,
        x,
        y,
        contextMenuConfig: {
          data,
          hasBackdrop: false,
          minWidth: 'auto',
          minHeight: 'auto',
        },
      })
      .closed.pipe(
        take(1),
        tap((data) => {
          console.log('data', data);
        }),
        // switchMap((result) => (!result ? of(null) : result)),
      )
      .subscribe(() => {});
  }
}
