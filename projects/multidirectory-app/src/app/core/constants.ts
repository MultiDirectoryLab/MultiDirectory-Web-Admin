export class Constants {
  static AccessToken = 'access_token';
  static RefreshToken = 'refresh_token';

  static RegexGetNameFromDn = /^\w{0,2}\=([^,]+).*$/gm;
  static RegexGetPathFormDn = /^\w{0,2}\=[^,]+,(.*)$/gm;
}
