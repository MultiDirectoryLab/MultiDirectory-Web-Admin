import { newCatalogRow } from '@models/api/catalog/newCatalogRow.model';

export interface CreateContactDialogData {
  dn: string;
}

export type CreateContactDialogReturnData = newCatalogRow;
