import { inject, Injectable } from '@angular/core';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  ContextMenuConfig,
  ContextMenuData,
  ContextMenuReturnData,
} from '../interfaces/context-menu-dialog.interface';
import { Subscription } from 'rxjs';
import { ContextMenuComponent } from '../components/core/context-menu/context-menu.component';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private dialog: Dialog = inject(Dialog);
  private overlay: Overlay = inject(Overlay);

  private contextMenuRef: DialogRef | null = null;
  private clickOutsideSubscription?: Subscription;

  /**
   * Открывает контекстное меню в заданных координатах.
   * @param x Координата x.
   * @param y Координата y.
   * @param component Компонент контекстного меню
   * @param contextMenuConfig Опции, содержащие данные и конфигурацию контекстного меню.
   * @returns Ссылка на созданный компонент.
   */
  public open<R = ContextMenuReturnData, D = ContextMenuData, C = ContextMenuComponent>({
    x,
    y,
    component,
    contextMenuConfig,
  }: ContextMenuConfig<R, D, C>): DialogRef<R, C> {
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

    const contextMenuRef = this.dialog.open<R, D, C>(component, config);

    this.contextMenuRef = contextMenuRef as DialogRef;

    this.initHandleOverlaySubscriptions();

    return contextMenuRef;
  }

  public close<R = ContextMenuReturnData>(result: R): void {
    if (this.contextMenuRef) {
      this.clickOutsideSubscription?.unsubscribe();
      this.contextMenuRef.close(result);
      this.contextMenuRef = null;
    }
  }

  private initHandleOverlaySubscriptions(): void {
    let isFirst = true;

    this.clickOutsideSubscription = this.contextMenuRef?.outsidePointerEvents.subscribe((data) => {
      if (data.type !== 'auxclick' && !isFirst) {
        this.close(this.contextMenuRef?.config.data);
        isFirst = true;
      }
      isFirst = false;
    });
  }
}
