export interface ConfirmDialogData {
  promptHeader: string;
  promptText: string;
  primaryButtons: ConfirmDialogButton[];
  secondaryButtons: ConfirmDialogButton[];
}

export interface ConfirmDialogButton {
  id: string | boolean;
  text: string;
}

export type ConfirmDialogReturnData = boolean | string | 'cancel';
