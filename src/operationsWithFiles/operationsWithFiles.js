import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { errorOperationFailed } from '../navigation/navigation.js'

export class OperationsWithFiles {
  constructor(state) {
    this.state = state;
  }

  async readFile() {
    return new Promise((resolve, reject) => {
      const pathToFile = this.state.getState().pathToFile;
      const rs = fs.createReadStream(pathToFile);
      const ws = process.stdout;

      rs.pipe(ws);

      rs.on('end', () => {
        ws.write('\n');
        this.state.setState({ pathToFile: '' });
        resolve();
      })

      rs.on('error', () => {
        reject(errorOperationFailed)
      })
    }).catch((err) => {
      console.log(err ? '' : errorOperationFailed);
    })
  }

  async addFile(filename) {
    try {
      const pathToFolder = this.state.getState().currentPathDir;
      const ws = fs.createWriteStream(path.join(pathToFolder, filename));
      ws.write('');
      console.log('the file was created successfully');
    } catch (error) {
      console.log(error ? '' : errorOperationFailed);
    }
  }

  async deleteFile() {
    try {
      const pathToFile = this.state.getState().pathToFile;
      await fs.promises.rm(pathToFile);
      this.state.setState({ pathToFile: '' });
      console.log('the file was successfully deleted');
    } catch (error) {
      console.log(error ? '' : errorOperationFailed);
    }
  }

  async renameFile(filename) {
    try {
      const pathToFile = this.state.getState().pathToFile;
      await fs.promises.rename(pathToFile, path.join(path.parse(pathToFile).dir, filename));
      console.log('the file has been renamed successfully');
    } catch (error) {
      console.log(error ? '' : errorOperationFailed);
    }
  }

  async copyFile() {
    try {
      const pathToFile = this.state.getState().pathToFile;
      const pathToNewDir = this.state.getState().pathToNewDir;

      const rs = fs.createReadStream(pathToFile);
      const ws = fs.createWriteStream(path.join(pathToNewDir, path.parse(pathToFile).base));

      await pipeline(rs, ws);

      console.log('the file has been copied successfully');
    } catch (error) {
      console.log(error ? '' : errorOperationFailed);
    }
  }

  async moveFile() {
    try {
      await this.copyFile();
      await this.deleteFile();
      console.log('the file was successfully transferred');
    } catch (error) {
      console.log(error ? '' : errorOperationFailed);
    }
  }
}