import os from 'os';
import { CommandLine } from './commandLine/commandLine.js';
import { State } from './state/state.js';

class Application {
  constructor() {
    this.username = process.argv.slice(2)[0].split('=')[1];
    this.init();
    this.state = new State({
      currentPathDir: process.cwd(),
      username: this.username,
    });
    this.commandLine = new CommandLine(this.state);
  }

  init() {
    const userHomeDir = os.homedir();
    process.chdir(userHomeDir);
    console.log(`Welcome to the File Manager, ${this.username} \n`);
    console.log(`You are currently in ${process.cwd()}`)
  }
}

new Application();