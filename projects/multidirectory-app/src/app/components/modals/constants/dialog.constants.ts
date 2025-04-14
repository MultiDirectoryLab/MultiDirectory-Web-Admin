import { DialogComponentWrapperConfig } from '../interfaces/dialog.interface';
import { InjectionToken } from '@angular/core';
import { DialogConfig } from '@angular/cdk/dialog';

export const DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG: DialogComponentWrapperConfig = {
  resizable: false,
  maximizable: false,
  closable: true,
  draggable: true,
};

export const DIALOG_CONFIG_DEFAULT: DialogConfig = {
  hasBackdrop: true,
  disableClose: false,
  role: 'dialog',
  minWidth: '16.25rem',
  minHeight: '12.5rem',
  width: '31.25rem',
};

export const DIALOG_COMPONENT_WRAPPER_CONFIG = new InjectionToken<DialogComponentWrapperConfig>(
  'DIALOG_COMPONENT_WRAPPER_CONFIG',
);

export const DIALOG_ANIMATION_SPEED = 0.35;

export const DIALOG_Z_INDEX_BASE = 1000;
