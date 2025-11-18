import { DialogRef } from '@angular/cdk/dialog';
import { filter } from 'rxjs';

export class ContextMenuRef<Result = any, Component = any, Action = any> {
  private _dialogRef: DialogRef<Result, Component>;
  constructor(ref: DialogRef<Result, Component>) {
    this._dialogRef = ref;
  }

  close(result: Result): void {
    this._dialogRef.close(result);
  }

  get onConfirmed() {
    return this._dialogRef.closed.pipe(filter(Boolean));
  }

  on(action: Action) {
    return this._dialogRef.closed.pipe(filter(x => x === action));
  }

  get outsidePointerEvents() {
    return this._dialogRef.outsidePointerEvents;
  }

  get closed() {
    return this._dialogRef.closed;
  }
}
