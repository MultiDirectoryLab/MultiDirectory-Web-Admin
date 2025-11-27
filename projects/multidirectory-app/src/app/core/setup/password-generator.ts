import { PasswordPolicy } from '@core/password-policy/password-policy';

export class PasswordGenerator {
  private static readonly latinLowerCase = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly latinUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly cyrillicLowerCase = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  private static readonly cyrillicUpperCase = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  private static readonly numbers = '0123456789';
  private static readonly symbols = '!@#$%^&*()_-,.';
  private static readonly keyboardSequences = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM', '1234567890'];

  static generatePassword(passwordPolicy?: PasswordPolicy): string {
    if (!passwordPolicy) {
      return this.generatePasswordLegacy(32);
    }

    const isCyrillic = passwordPolicy.language === 'Cyrillic';
    const lowerCaseLetters = isCyrillic ? this.cyrillicLowerCase : this.latinLowerCase;
    const upperCaseLetters = isCyrillic ? this.cyrillicUpperCase : this.latinUpperCase;

    const minRequiredLength =
      passwordPolicy.minLowercaseLettersCount +
      passwordPolicy.minUppercaseLettersCount +
      passwordPolicy.minDigitsCount +
      passwordPolicy.minSpecialSymbolsCount;

    const passwordLength = Math.max(passwordPolicy.minLength, Math.min(passwordPolicy.maxLength, Math.max(minRequiredLength, 16)));

    const password: string[] = [];
    const usedChars = new Set<string>();

    for (let i = 0; i < passwordPolicy.minLowercaseLettersCount; i++) {
      const char = this.getRandomCharAvoidingRepeat(lowerCaseLetters, password);
      password.push(char);
      usedChars.add(char);
    }

    for (let i = 0; i < passwordPolicy.minUppercaseLettersCount; i++) {
      const char = this.getRandomCharAvoidingRepeat(upperCaseLetters, password);
      password.push(char);
      usedChars.add(char);
    }

    for (let i = 0; i < passwordPolicy.minDigitsCount; i++) {
      const char = this.getRandomCharAvoidingRepeat(this.numbers, password);
      password.push(char);
      usedChars.add(char);
    }

    for (let i = 0; i < passwordPolicy.minSpecialSymbolsCount; i++) {
      const char = this.getRandomCharAvoidingRepeat(this.symbols, password);
      password.push(char);
      usedChars.add(char);
    }

    const allChars = lowerCaseLetters + upperCaseLetters + this.numbers + this.symbols;

    while (password.length < passwordLength) {
      const char = this.getRandomCharAvoidingRepeat(allChars, password);
      password.push(char);
      usedChars.add(char);
    }

    this.shuffleArray(password);

    let attempts = 0;
    const maxAttempts = 200;

    while (attempts < maxAttempts && !this.isPasswordValid(password.join(''), passwordPolicy)) {
      this.fixPasswordViolations(password, passwordPolicy, lowerCaseLetters, upperCaseLetters);
      attempts++;

      if (attempts % 50 === 0 && !this.isPasswordValid(password.join(''), passwordPolicy)) {
        this.shuffleArray(password);
      }
    }

    if (passwordPolicy.maxRepeatingSymbolsInRowCount >= 0) {
      this.ensureNoRepeatingChars(password, passwordPolicy.maxRepeatingSymbolsInRowCount, allChars);
    }

    const lastSix = password.slice(-6).join('');

    if (/^\d{6}$/.test(lastSix)) {
      for (let i = password.length - 7; i >= 0; i--) {
        if (!/\d/.test(password[i])) {
          [password[password.length - 1], password[i]] = [password[i], password[password.length - 1]];
          break;
        }
      }
    }

    const uniqueChars = new Set(password).size;

    if (passwordPolicy.minUniqueSymbolsCount > 0 && uniqueChars < passwordPolicy.minUniqueSymbolsCount) {
      const needed = passwordPolicy.minUniqueSymbolsCount - uniqueChars;
      const availableUniqueChars = Array.from(allChars).filter((c) => !usedChars.has(c));
      for (let i = 0; i < needed && i < availableUniqueChars.length && password.length < passwordPolicy.maxLength; i++) {
        const char = availableUniqueChars[i];
        password.push(char);
        usedChars.add(char);
      }
    }

    return password.join('');
  }

  private static generatePasswordLegacy(passwordLength: number): string {
    const lowerCaseLetters = this.latinLowerCase;
    const upperCaseLetters = this.latinUpperCase;
    const numbers = this.numbers;
    const symbols = this.symbols;

    const availableCharacters = lowerCaseLetters + upperCaseLetters + numbers + symbols;
    const generatedPassword: string[] = [];

    for (let i = 0; i < passwordLength; i += 1) {
      const idx = Math.floor(Math.random() * availableCharacters.length);
      generatedPassword.push(availableCharacters[idx]);
    }

    return generatedPassword.join('');
  }

  private static getRandomChar(charSet: string): string {
    const idx = Math.floor(Math.random() * charSet.length);
    return charSet[idx];
  }

  private static getRandomCharAvoidingRepeat(charSet: string, password: string[]): string {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const char = this.getRandomChar(charSet);
      if (password.length === 0 || password[password.length - 1] !== char) {
        return char;
      }
      attempts++;
    }

    return this.getRandomChar(charSet);
  }

  private static ensureNoRepeatingChars(password: string[], maxAllowed: number, allChars: string): void {
    let i = 0;
    while (i < password.length - 1) {
      let repeatCount = 1;
      let lastRepeatIndex = i;

      for (let j = i + 1; j < password.length && password[j] === password[i]; j++) {
        repeatCount++;
        lastRepeatIndex = j;
      }

      if (repeatCount > maxAllowed + 1) {
        const charsToReplace = repeatCount - (maxAllowed + 1);
        for (let k = 0; k < charsToReplace; k++) {
          const replaceIndex = i + 1 + k;
          let newChar = this.getRandomChar(allChars);
          let attempts = 0;
          const maxAttempts = 100;

          while (attempts < maxAttempts) {
            const prevChar = replaceIndex > 0 ? password[replaceIndex - 1] : null;
            const nextChar = replaceIndex < password.length - 1 ? password[replaceIndex + 1] : null;

            if (newChar !== prevChar && newChar !== nextChar) {
              password[replaceIndex] = newChar;
              break;
            }
            newChar = this.getRandomChar(allChars);
            attempts++;
          }

          if (attempts >= maxAttempts) {
            password[replaceIndex] = this.getRandomChar(allChars);
          }
        }
        i = Math.max(0, i - 1);
      } else {
        i = lastRepeatIndex + 1;
      }
    }
  }

  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private static isPasswordValid(password: string, policy: PasswordPolicy): boolean {
    const passwordLower = password.toLowerCase();
    const maxAllowed = policy.maxRepeatingSymbolsInRowCount;

    for (let i = 0; i < password.length - 1; i++) {
      let repeatCount = 1;

      for (let j = i + 1; j < password.length && password[j] === password[i]; j++) {
        repeatCount++;
      }

      if (repeatCount > maxAllowed + 1) {
        return false;
      }
    }

    if (policy.maxSequentialKeyboardSymbolsCount > 0) {
      const minSeqLength = policy.maxSequentialKeyboardSymbolsCount + 1;

      for (const sequence of this.keyboardSequences) {
        for (let i = 0; i <= sequence.length - minSeqLength; i++) {
          const subSeq = sequence.substring(i, i + minSeqLength).toLowerCase();
          if (passwordLower.includes(subSeq)) {
            return false;
          }
        }

        const reversed = sequence.split('').reverse().join('');

        for (let i = 0; i <= reversed.length - minSeqLength; i++) {
          const subSeq = reversed.substring(i, i + minSeqLength).toLowerCase();
          if (passwordLower.includes(subSeq)) {
            return false;
          }
        }
      }
    }

    if (policy.maxSequentialAlphabetSymbolsCount > 0) {
      const alphabet = policy.language === 'Cyrillic' ? this.cyrillicLowerCase : this.latinLowerCase;
      const minSeqLength = policy.maxSequentialAlphabetSymbolsCount + 1;

      for (let i = 0; i <= alphabet.length - minSeqLength; i++) {
        const subSeq = alphabet.substring(i, i + minSeqLength).toLowerCase();
        if (passwordLower.includes(subSeq)) {
          return false;
        }
      }

      const reversed = alphabet.split('').reverse().join('');

      for (let i = 0; i <= reversed.length - minSeqLength; i++) {
        const subSeq = reversed.substring(i, i + minSeqLength).toLowerCase();
        if (passwordLower.includes(subSeq)) {
          return false;
        }
      }
    }

    return true;
  }

  private static fixPasswordViolations(
    password: string[],
    policy: PasswordPolicy,
    lowerCaseLetters: string,
    upperCaseLetters: string,
  ): void {
    const allChars = lowerCaseLetters + upperCaseLetters + this.numbers + this.symbols;
    const maxAllowed = policy.maxRepeatingSymbolsInRowCount;

    let i = 0;
    while (i < password.length - 1) {
      let repeatCount = 1;
      let lastRepeatIndex = i;

      for (let j = i + 1; j < password.length && password[j] === password[i]; j++) {
        repeatCount++;
        lastRepeatIndex = j;
      }

      if (repeatCount > maxAllowed + 1) {
        const charsToReplace = repeatCount - (maxAllowed + 1);
        for (let k = 0; k < charsToReplace; k++) {
          const replaceIndex = i + 1 + k;
          let newChar = this.getRandomChar(allChars);
          let attempts = 0;
          const maxAttempts = 100;

          while (attempts < maxAttempts) {
            if (replaceIndex > 0 && newChar === password[replaceIndex - 1]) {
              newChar = this.getRandomChar(allChars);
              attempts++;
              continue;
            }
            if (replaceIndex < password.length - 1 && newChar === password[replaceIndex + 1]) {
              newChar = this.getRandomChar(allChars);
              attempts++;
              continue;
            }
            break;
          }

          password[replaceIndex] = newChar;
        }
        i = Math.max(0, i - 1);
      } else {
        i++;
      }
    }

    if (policy.maxSequentialKeyboardSymbolsCount > 0) {
      const minSeqLength = policy.maxSequentialKeyboardSymbolsCount + 1;
      let passwordLower = password.join('').toLowerCase();

      for (const sequence of this.keyboardSequences) {
        for (let i = 0; i <= sequence.length - minSeqLength; i++) {
          const subSeq = sequence.substring(i, i + minSeqLength).toLowerCase();
          let searchIndex = 0;

          while ((searchIndex = passwordLower.indexOf(subSeq, searchIndex)) !== -1) {
            const replaceIndex = searchIndex + Math.floor(Math.random() * subSeq.length);
            password[replaceIndex] = this.getRandomChar(allChars);
            passwordLower = password.join('').toLowerCase();
            searchIndex++;
          }
        }
        const reversed = sequence.split('').reverse().join('');
        for (let i = 0; i <= reversed.length - minSeqLength; i++) {
          const subSeq = reversed.substring(i, i + minSeqLength).toLowerCase();
          let searchIndex = 0;

          while ((searchIndex = passwordLower.indexOf(subSeq, searchIndex)) !== -1) {
            const replaceIndex = searchIndex + Math.floor(Math.random() * subSeq.length);
            password[replaceIndex] = this.getRandomChar(allChars);
            passwordLower = password.join('').toLowerCase();
            searchIndex++;
          }
        }
      }
    }

    if (policy.maxSequentialAlphabetSymbolsCount > 0) {
      const alphabet = policy.language === 'Cyrillic' ? this.cyrillicLowerCase : this.latinLowerCase;
      const minSeqLength = policy.maxSequentialAlphabetSymbolsCount + 1;
      let passwordLower = password.join('').toLowerCase();

      for (let i = 0; i <= alphabet.length - minSeqLength; i++) {
        const subSeq = alphabet.substring(i, i + minSeqLength).toLowerCase();
        let searchIndex = 0;

        while ((searchIndex = passwordLower.indexOf(subSeq, searchIndex)) !== -1) {
          const replaceIndex = searchIndex + Math.floor(Math.random() * subSeq.length);
          password[replaceIndex] = this.getRandomChar(allChars);
          passwordLower = password.join('').toLowerCase();
          searchIndex++;
        }
      }

      const reversed = alphabet.split('').reverse().join('');
      for (let i = 0; i <= reversed.length - minSeqLength; i++) {
        const subSeq = reversed.substring(i, i + minSeqLength).toLowerCase();
        let searchIndex = 0;

        while ((searchIndex = passwordLower.indexOf(subSeq, searchIndex)) !== -1) {
          const replaceIndex = searchIndex + Math.floor(Math.random() * subSeq.length);
          password[replaceIndex] = this.getRandomChar(allChars);
          passwordLower = password.join('').toLowerCase();
          searchIndex++;
        }
      }
    }
  }
}
