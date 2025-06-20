import { ConfirmButtonDescriptor } from './confirm-button-descriptor';

export interface ConfirmDialogDescriptor {
  promptHeader: string;
  promptText: string;
  primaryButtons: ConfirmButtonDescriptor[];
  secondaryButtons: ConfirmButtonDescriptor[];
}
