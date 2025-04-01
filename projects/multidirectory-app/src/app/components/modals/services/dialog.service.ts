import { inject, Injectable } from '@angular/core';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { take } from 'rxjs';
import { DialogOpenOptions } from '../interfaces/dialog.interface';
import {
  DIALOG_COMPONENT_WRAPPER_CONFIG,
  DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG,
  DIALOG_Z_INDEX_BASE,
} from '../constants/dialog.constants';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(Dialog);

  private openedDialogs: DialogRef[] = [];

  /**
   * Открывает диалоговое окно с настройками.
   * @param component Компонент, который нужно отобразить в модальном окне.
   * @param dialogConfig Опции, содержащие данные и конфигурацию диалога.
   * @param componentConfig Опции, содержащие данные и конфигурацию компонента обертки диалога.
   * @returns Ссылка на диалоговое окно.
   */
  public open<R, D, C>({
    component,
    dialogConfig,
    componentConfig,
  }: DialogOpenOptions<R, D, C>): DialogRef<R, C> {
    const config: DialogConfig<D, DialogRef<R, C>> = {
      providers: [
        {
          provide: DIALOG_COMPONENT_WRAPPER_CONFIG,
          useFactory: () => ({
            ...DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG,
            ...(componentConfig ?? {}),
          }),
        },
      ],
      ...(dialogConfig ?? {}),
    };
    // TODO: Подумать над резолвом дефолтных параметров типа ширина/высота для компонента диалога

    const dialogRef = this.dialog.open<R, D, C>(component, config);

    this.openedDialogs.push(dialogRef as DialogRef);
    this.updateZIndex(dialogRef, this.openedDialogs.length - 1);

    dialogRef.closed.pipe(take(1)).subscribe(() => {
      this.openedDialogs = this.openedDialogs.filter((ref) => ref.id !== dialogRef.id);
    });

    return dialogRef;
  }

  public close<R, C>(dialogRef: DialogRef<R, C>, data?: R): void {
    dialogRef.close(data);

    this.openedDialogs = this.openedDialogs.filter((ref) => ref.id !== dialogRef.id);
  }

  public bringToFront(dialogRef: DialogRef | null): void {
    if (!dialogRef) return;

    this.openedDialogs = this.openedDialogs.filter((ref) => ref.id !== dialogRef.id);
    this.openedDialogs.forEach((ref, index) => this.updateZIndex(ref, index));

    this.updateZIndex(dialogRef, this.openedDialogs.length);

    this.openedDialogs.push(dialogRef);
  }

  private updateZIndex<R, C>(dialogRef: DialogRef<R, C>, index: number): void {
    const zIndex = DIALOG_Z_INDEX_BASE + index;

    if (dialogRef.overlayRef.backdropElement) {
      dialogRef.overlayRef.backdropElement.style.zIndex = zIndex.toString();
    }
    dialogRef.overlayRef.overlayElement.style.zIndex = zIndex.toString();
    dialogRef.overlayRef.hostElement.style.zIndex = zIndex.toString();
  }
}
