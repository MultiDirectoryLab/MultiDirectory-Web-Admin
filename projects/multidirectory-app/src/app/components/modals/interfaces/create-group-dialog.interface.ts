import { CreateEntryResponse } from '@models/api/entry/create-response';

export type CreateGroupDialogReturnData = CreateEntryResponse | undefined;

export interface CreateGroupDialogData {
  parentDn: string;
}
