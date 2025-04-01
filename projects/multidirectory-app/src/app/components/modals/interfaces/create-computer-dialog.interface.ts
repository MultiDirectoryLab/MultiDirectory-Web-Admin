import { CreateEntryResponse } from '@models/entry/create-response';

export type CreateComputerDialogReturnData = CreateEntryResponse | null;

export interface CreateComputerDialogData {
  parentDn: string;
}
