import { CreateEntryResponse } from '@models/entry/create-response';

export type CreateGroupDialogReturnData = CreateEntryResponse | undefined;

export interface CreateGroupDialogData {
  parentDn: string;
}
