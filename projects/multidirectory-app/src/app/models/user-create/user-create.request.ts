import BitSet from 'bitset';

export class UserCreateRequest {
  firstName = '';
  initials = '';
  lastName = '';
  fullName = '';
  description = '';
  upnLogin = '';
  upnDomain = '';
  domainLogin = '';
  legacyLogin = '';
  legacyDomain = '';
  password = '';
  repeatPassword = '';
  userShouldChangePassword = false;
  userCannotChangePassword = false;
  userPasswordExpired = false;
  accountDisabled = false;
  uacBitSet = new BitSet();
  pwdLastSet = Date.now().toString();
  constructor() {}
}
