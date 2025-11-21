import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { BaseContextMenuComponent } from '@components/modals/components/context-menus/base-context-menu/base-context-menu.component';
import { ContextMenuAction, ContextMenuItem } from '@models/core/context-menu/context-menu-item';
import { ContextMenuRef } from '@models/core/context-menu/context-menu-ref';
import { of, Subscription } from 'rxjs';
import { ContextMenuComponent } from '../components/core/context-menu/context-menu.component';
import { ContextMenuConfig, ContextMenuData, ContextMenuReturnData } from '../interfaces/context-menu-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private dialog: Dialog = inject(Dialog);
  private overlay: Overlay = inject(Overlay);

  private contextMenuRef: ContextMenuRef | null = null;
  private clickOutsideSubscription?: Subscription;

  /**
   * Открывает контекстное меню в заданных координатах.
   * @param x Координата x.
   * @param y Координата y.
   * @param component Компонент контекстного меню
   * @param contextMenuConfig Опции, содержащие данные и конфигурацию контекстного меню.
   * @returns Ссылка на созданный компонент.
   */
  open<R = ContextMenuReturnData, D = ContextMenuData, C = ContextMenuComponent, A = ContextMenuAction>({
    x,
    y,
    component,
    contextMenuConfig,
  }: ContextMenuConfig<R, D, C>): ContextMenuRef<R, C, A> {
    this.close('close');

    const config: DialogConfig<D, DialogRef<R, C>> = {
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x, y })
        .withLockedPosition(true)
        .withPositions([
          {
            overlayX: 'start',
            overlayY: 'top',
            originX: 'start',
            originY: 'top',
          },
        ]),
      ...(contextMenuConfig ?? {}),
    };

    const contextMenuRef = new ContextMenuRef<R, C, A>(this.dialog.open<R, D, C>(component, config));

    this.contextMenuRef = contextMenuRef;

    this.initHandleOverlaySubscriptions();

    return contextMenuRef;
  }

  openBaseMenu<T = ContextMenuAction>(items: ContextMenuItem[], x: number, y: number): ContextMenuRef<null, BaseContextMenuComponent, T> {
    return this.open<null, ContextMenuItem[], BaseContextMenuComponent, T>({
      component: BaseContextMenuComponent,
      x: x,
      y: y,
      contextMenuConfig: {
        data: items,
        hasBackdrop: false,
        minWidth: 'auto',
        minHeight: 'auto',
      },
    });
  }

  close<R = ContextMenuReturnData>(result: R): void {
    if (this.contextMenuRef) {
      this.clickOutsideSubscription?.unsubscribe();
      this.contextMenuRef.close(result);
      this.contextMenuRef = null;
    }
  }

  private initHandleOverlaySubscriptions(): void {
    let isFirst = true;

    this.clickOutsideSubscription = this.contextMenuRef?.outsidePointerEvents.subscribe((event) => {
      if (event.type !== 'auxclick' && !isFirst) {
        this.close(of(null));
        isFirst = true;
      } else {
        isFirst = false;
      }
    });
  }
}
