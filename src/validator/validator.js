export class Validator {
  constructor() {
    this.validCommand = ['up', 'cd', 'ls', 'cat', 'add', 'rn', 'cp', 'mv', 'rm', 'hash', 'os', 'compress', 'decompress', '.exit'];
  }

  isInvalidInput(command) {
    return this.validCommand.includes(command);
  }
}