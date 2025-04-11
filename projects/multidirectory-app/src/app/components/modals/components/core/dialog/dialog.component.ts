import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DragDrop, DragRef, Point } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subject, takeUntil, timer } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../services/dialog.service';
import {
  DIALOG_ANIMATION_SPEED,
  DIALOG_COMPONENT_WRAPPER_CONFIG,
  DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG,
} from '../../../constants/dialog.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IdProvider } from '../../../../../../../../multidirectory-ui-kit/src/lib/utils/id-provider';
import { SpinnerHostDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [AsyncPipe, NgClass, SpinnerHostDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {
  public componentConfig =
    inject(DIALOG_COMPONENT_WRAPPER_CONFIG, { optional: true }) ||
    DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG;

  @ViewChild('modalHeader', { static: true }) modalHeader!: ElementRef<HTMLDivElement>;
  @ViewChild('controlBar', { static: true }) controlBar!: ElementRef<HTMLDivElement>;
  @ViewChild(SpinnerHostDirective, { static: true }) spinnerHost!: SpinnerHostDirective;
  public dragging$ = new Subject<boolean>();
  public maximized$ = new BehaviorSubject<boolean>(false);
  public __ID = IdProvider.getUniqueId('dialog');
  public spinnerText = '';

  private dragDrop = inject(DragDrop);
  private dialogRef = inject(DialogRef, { optional: true });
  private dialogService = inject(DialogService);
  private destroyRef$ = inject(DestroyRef);

  private dragRef: DragRef | null = null;
  private lastPosition: Point = { x: 0, y: 0 };
  private dialogRefConfig?: DialogConfig = { ...(this.dialogRef?.config as DialogConfig) };
  private cancelAnimationTrigger$: Subject<void> = new Subject<void>();

  @HostListener('mousedown', ['$event']) mouseDown(event: Event): void {
    if (this.componentConfig.draggable) {
      const targetIsHeader = !!(event.target as HTMLElement).closest(
        '.' + this.modalHeader.nativeElement.className,
      );
      const targetIsControlBar = !!(event.target as HTMLElement).closest(
        '.' + this.controlBar.nativeElement.className,
      );
      const isMaximized = this.maximized$.getValue();

      if ([targetIsHeader, !targetIsControlBar, !isMaximized].every((i) => i)) {
        this.dragging$.next(true);
      }
    }

    this.dialogService.bringToFront(this.dialogRef);
  }

  @HostListener('mouseup', ['$event']) mouseUp(event: Event): void {
    this.dragging$.next(false);

    this.dialogService.bringToFront(this.dialogRef);
  }

  public ngOnInit(): void {
    if (this.componentConfig.draggable && this.dialogRef) {
      this.dragRef = this.createDragRef(this.dialogRef);
      this.initSubscriptions();
      this.updateDragRef();
    }
  }

  public ngOnDestroy(): void {
    this.dragging$.complete();
    this.maximized$.complete();
  }

  public toggleMaximize($event?: MouseEvent): void {
    if (this.dialogRef && this.dialogRefConfig) {
      const isMaximized = this.maximized$.getValue();

      this.updateGlobalOverlayTransition();
      this.maximized$.next(!isMaximized);

      if (isMaximized) {
        this.enableDragRefHandle();
        this.dialogRef.updateSize(this.dialogRefConfig.width, this.dialogRefConfig.height);
        this.setDragPosition(this.lastPosition);
      } else {
        this.saveLastPosition();
        this.disableDragRefHandle();

        // 99.9vw потому, что CdkDialog ставит для глобального враппера
        // cdk-global-overlay-wrapper свойство justify-content: flex-start
        // когда окно прижато к левому краю и оно получается прыгает в верстке
        this.dialogRef.updateSize('99.9vw', '100dvh');
        this.setDragPosition({ x: 0, y: 0 });
      }

      this.dialogRef.updatePosition();
    }
  }

  public close(data?: any): void {
    if (!this.dialogRef) return;

    this.dialogService.close(this.dialogRef);
  }

  public showSpinner(): void {
    if (!this.spinnerHost) return;

    this.spinnerHost.show();
  }

  public hideSpinner(): void {
    if (!this.spinnerHost) return;

    this.spinnerHost.hide();
  }

  public modalHeaderMouseDown(event: MouseEvent): void {
    this.dragStart(event);
  }

  private updateGlobalOverlayTransition(): void {
    if (!this.dialogRef) return;

    this.cancelAnimationTrigger$.next();

    this.dialogRef.overlayRef.overlayElement.style.transition = `
      ${DIALOG_ANIMATION_SPEED}s width cubic-bezier(0.37, 0.01, 0, 0.97),
      ${DIALOG_ANIMATION_SPEED}s height cubic-bezier(0.37, 0.01, 0, 0.97),
      ${DIALOG_ANIMATION_SPEED}s transform cubic-bezier(0.37, 0.01, 0, 0.97)
    `;

    timer(DIALOG_ANIMATION_SPEED * 1000)
      .pipe(takeUntil(this.cancelAnimationTrigger$))
      .subscribe(
        () => this.dialogRef && (this.dialogRef.overlayRef.overlayElement.style.transition = ''),
      );
  }

  private createDragRef(dialogRef: DialogRef): DragRef {
    return this.dragDrop.createDrag(dialogRef.overlayRef.overlayElement);
  }

  private updateDragRef(): void {
    if (!this.dragRef) return;

    this.dragRef = this.dragRef
      .withHandles([this.modalHeader])
      .withBoundaryElement(this.dialogRef && this.dialogRef.overlayRef.hostElement);
  }

  private initSubscriptions(): void {
    if (!this.dragRef) return;

    this.dragRef.started
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(({ event }) => this.dragStart(event));

    this.dragRef.ended
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(({ event }) => this.dragEnd(event));
  }

  private dragStart<T extends Event>(event: T): void {
    this.dialogService.bringToFront(this.dialogRef);
  }

  private dragEnd<T extends Event>(event: T): void {
    this.dragging$.next(false);
    this.saveLastPosition();
  }

  private saveLastPosition() {
    if (!this.dragRef) return;

    this.lastPosition = this.dragRef.getFreeDragPosition();
  }

  private setDragPosition(position: Point) {
    if (!this.dragRef) return;

    this.dragRef.setFreeDragPosition(position);
  }

  private enableDragRefHandle(): void {
    if (!this.dragRef) return;

    this.dragRef.enableHandle(this.modalHeader.nativeElement);
  }

  private disableDragRefHandle(): void {
    if (!this.dragRef) return;

    this.dragRef.disableHandle(this.modalHeader.nativeElement);
  }
}
