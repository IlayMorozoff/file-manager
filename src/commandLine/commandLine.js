import { Navigation } from '../navigation/navigation.js';
import fs from 'fs';

export class CommandLine {

  constructor(state) {
    this.state = state;
    this.navigation = new Navigation(this.state);
    this.startProcess();
  }

  startProcess() {
    process.stdin.on('data', async (data) => {
      const command = data.toString().trim().split(' ');

      const pathToDir = command[1];

      switch (command[0]) {
        case '.exit':
          this.closeProccess();
          break;
        case 'ls':
          let filesAndFoldes;
          const pathToCurrentFolder = this.state.getState().currentPathDir;

          if (command[1]) {
            filesAndFoldes = await fs.promises.readdir(command[1]);
          } else {
            filesAndFoldes = await fs.promises.readdir(pathToCurrentFolder);
          }
          console.log(filesAndFoldes)
          break;

        case 'up':
          this.navigation.upToPath(command);
          break;
        case 'cd':
          if (pathToDir) {
            await this.navigation.moveToDir(pathToDir);
          }
          break;
        default:
          break;
      }
      this.printCurrentPathToWorkingDir()
    });
    process.on('SIGINT', this.closeProccess.bind(this));
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