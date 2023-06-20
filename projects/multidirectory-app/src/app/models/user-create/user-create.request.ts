
export class UserCreateRequest {
    firstName = '';
    initials = '';
    lastName = '';
    fullName = '';
    upnLogin= '';
    upnDomain = '';
    domainLogin = '';
    legacyLogin = '';
    legacyDomain = '';
    password = '';
    repeatPassword =  '';
    userShouldChangePassword = false;
    userCannotChangePassword = false;
    userPasswordExpired = false;
    accountDisabled = false;

    constructor() {
      
    }
}