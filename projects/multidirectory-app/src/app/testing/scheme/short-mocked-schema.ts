import { SearchResponse } from '@models/entry/search-response';

export const ShortMockedSchema: SearchResponse = {
  resultCode: 0,
  matchedDn: '',
  errorMessage: '',
  total_pages: 0,
  total_objects: 0,
  search_result: [
    {
      object_name: 'CN=Schema',
      partial_attributes: [
        {
          type: 'name',
          vals: ['Schema'],
        },
        {
          type: 'objectClass',
          vals: ['subSchema', 'top'],
        },
        {
          type: 'attributeTypes',
          vals: [
            "( 1.2.840.113556.1.4.1 NAME 'name' SYNTAX '1.3.6.1.4.1.1466.115.121.1.15' SINGLE-VALUE  )",
            "( 2.5.4.0 NAME 'objectClass' SYNTAX '1.3.6.1.4.1.1466.115.121.1.38'  )",
          ],
        },
      ],
    },
  ],
};
