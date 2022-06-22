import fs from 'fs';
import { Navigation, errorOperationFailed } from '../navigation/navigation.js';
import { Validator } from '../validator/validator.js';
import { OperationsWithFiles } from '../operationsWithFiles/operationsWithFiles.js';
import { OperatingSystemInfo } from '../operatingSystemInfo/operatingSystemInfo.js';
import { HashCalculator } from '../hashCalculator/hashCalculator.js';
import { CompressDecompress } from '../compressDecompress/compressDecompress.js';
import { FolderInfo } from '../folderInfo/folderInfo.js';

export const errorInvalidInput = 'Invalid input';

export class CommandLine {

  constructor(state) {
    this.state = state;
    this.folderInfo = new FolderInfo(this.state);
    this.navigation = new Navigation(this.state);
    this.operationsWithFiles = new OperationsWithFiles(this.state);
    this.validator = new Validator();
    this.operatingSystemInfo = new OperatingSystemInfo();
    this.hashCalculator = new HashCalculator(this.state);
    this.compressDecompress = new CompressDecompress(this.state);
    this.startProcess();
  }

  async startProcess() {
    try {
      process.stdin.on('data', async (data) => {

        let command = data.toString().trim().split("'").filter((item) => !!item).join('').split('"').filter((item) => !!item && item !== ' ').map((item) => item.trim());

        if (command.some((el) => el.includes(' ')) && this.validator.isInvalidInput(command[0])) {

        } else {
          command = data.toString().trim().split(' ').filter((item) => item);
        }

        if (!this.validator.isInvalidInput(command[0])) {
          console.log(errorInvalidInput);
        }

        const pathToDir = command[1];

        switch (command[0]) {
          case '.exit':
            this.closeProccess();
            break;
          case 'ls':
            if (command.length === 1) {
              await this.folderInfo.showInfo();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'up':
            await this.navigation.moveToDir(_, true);
            break;
          case 'cd':
            if (pathToDir && command.length === 2) {
              await this.navigation.moveToDir(pathToDir, true);
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'cat':
            if (pathToDir && command.length === 2) {
              await this.navigation.moveToDir(pathToDir, false);
              await this.operationsWithFiles.readFile();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'add':
            if (pathToDir && command.length === 2) {
              await this.operationsWithFiles.addFile(pathToDir);
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'rm':
            if (pathToDir && command.length === 2) {
              await this.navigation.moveToDir(pathToDir, false);
              await this.operationsWithFiles.deleteFile();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'rn':
            if (command.length === 3) {
              await this.navigation.moveToDir(pathToDir, false);
              await this.operationsWithFiles.renameFile(command[2]);
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'cp':
            if (command.length === 3) {
              await this.navigation.moveToDir(command[2], true, true);
              await this.navigation.moveToDir(pathToDir, false);
              await this.operationsWithFiles.copyFile();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'mv':
            if (command.length === 3) {
              await this.navigation.moveToDir(command[2], true, true);
              await this.navigation.moveToDir(pathToDir, false);
              await this.operationsWithFiles.moveFile();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'os':
            if (command.length === 2) {
              this.operatingSystemInfo.showData(command[1]);
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'hash':
            if (command.length === 2) {
              await this.navigation.moveToDir(command[1], false)
              await this.hashCalculator.calculateHash();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'compress':
            if (command.length === 3) {
              await this.navigation.moveToDir(command[2], true, true);
              await this.navigation.moveToDir(command[1], false);
              await this.compressDecompress.compressFile();
            } else {
              console.log(errorOperationFailed);
            }
            break;
          case 'decompress':
            if (command.length === 3) {
              await this.navigation.moveToDir(command[2], true, true);
              await this.navigation.moveToDir(command[1], false);
              await this.compressDecompress.decompressFile();
            } else {
              console.log(errorOperationFailed);
            }
            break;
        }

        this.printCurrentPathToWorkingDir();
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