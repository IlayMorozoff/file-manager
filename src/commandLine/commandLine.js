import { Navigation } from '../navigation/navigation.js';
import { Validator } from '../validator/validator.js';
import fs from 'fs';

const errorInvalidInput = 'Invalid input';

export class CommandLine {

  constructor(state) {
    this.state = state;
    this.navigation = new Navigation(this.state);
    this.validator = new Validator();
    this.startProcess();
  }

  async startProcess() {
    try {
      process.stdin.on('data', async (data) => {
        const command = data.toString().trim().split(' ');

        if (!this.validator.isInvalidInput(command[0])) {
          console.log(errorInvalidInput);
        }

        const pathToDir = command[1];
        switch (command[0]) {
          case '.exit':
            this.closeProccess();
            break;
          case 'ls':
            const pathToCurrentFolder = this.state.getState().currentPathDir;
            const filesAndFoldes = await fs.promises.readdir(pathToCurrentFolder);
            for (let el of filesAndFoldes) {
              console.log(el);
            }
            break;
          case 'up':
            await this.navigation.moveToDir();
            break;
          case 'cd':
            if (pathToDir) {
              await this.navigation.moveToDir(pathToDir);
            }
            break;
        }

        this.printCurrentPathToWorkingDir()
      });
      process.on('SIGINT', this.closeProccess.bind(this));
    } catch (error) {
      console.log(errorInvalidInput);
    }
  }

  closeProccess() {
    const state = this.state.getState();
    process.stdout.write(`Thank you for using File Manager, ${state.username} \n`);
    process.exit(0);
  }

  printCurrentPathToWorkingDir() {
    const curentPathToDir = this.state.getState().currentPathDir;
    console.log(`You are currently in ${curentPathToDir}`);
  }
}