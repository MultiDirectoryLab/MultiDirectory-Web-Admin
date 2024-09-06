export class PasswordGenerator {
  static generatePassword(passwordLength = 32): string {
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_-,.';

    let availableCharacters = '';
    availableCharacters += lowerCaseLetters;
    availableCharacters += upperCaseLetters;
    availableCharacters += numbers;
    availableCharacters += symbols;
    availableCharacters.split('');
    const generatedPassword = [];

    for (let i = 0; i < passwordLength; i += 1) {
      const max = availableCharacters.length;
      const ran = Math.random();
      const idx = Math.floor(ran * (max + 1));

      generatedPassword.push(availableCharacters[idx]);
    }

    return generatedPassword.join('');
  }
}
