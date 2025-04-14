import { DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';

export interface DialogOpenOptions<R, D, C> {
  component: ComponentType<C>;
  dialogConfig?: Partial<DialogConfig<D, DialogRef<R, C>>>;
  componentConfig?: Partial<DialogComponentWrapperConfig>;
}

export interface DialogComponentWrapperConfig {
  closable: boolean;
  resizable: boolean;
  maximizable: boolean;
  draggable: boolean;
}
