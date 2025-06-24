import { CreateEntryResponse } from '@models/api/entry/create-response';

export type CreateComputerDialogReturnData = CreateEntryResponse | null;

export interface CreateComputerDialogData {
  parentDn: string;
}
