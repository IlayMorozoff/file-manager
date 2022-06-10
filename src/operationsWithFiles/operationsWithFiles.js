import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';

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
        reject('Operation failed')
      })
    }).catch(() => {
      console.log('Operation failed')
    })
  }

  async addFile(filename) {
    try {
      const pathToFolder = this.state.getState().currentPathDir;
      const ws = fs.createWriteStream(path.join(pathToFolder, filename));
      ws.write('');
      console.log('the file was created successfully');
    } catch (error) {
      console.log(error ? '' : 'Operation failed');
    }
  }

  async deleteFile() {
    try {
      const pathToFile = this.state.getState().pathToFile;
      await fs.promises.rm(pathToFile);
      this.state.setState({ pathToFile: '' });
      console.log('the file was successfully deleted');
    } catch (error) {
      console.log(error ? '' : 'Operation failed');
    }
  }

  async renameFile(filename) {
    try {
      const pathToFile = this.state.getState().pathToFile;
      await fs.promises.rename(pathToFile, path.join(path.parse(pathToFile).dir, filename));
      console.log(pathToFile, path.join(path.parse(pathToFile).dir, filename));
    } catch (error) {
      console.log(error ? '' : 'Operation failed');
    }
  }

  async copyFile() {
    try {
      const pathToFile = this.state.getState().pathToFile;
      const pathToNewDir = this.state.getState().pathToNewDir;

      const rs = fs.createReadStream(pathToFile);
      const ws = fs.createWriteStream(path.join(pathToNewDir, path.parse(pathToFile).base));

      await pipeline(rs, ws);
    } catch (error) {
      console.log(error ? '' : 'Operation failed');
    }
  }

  async moveFile() {
    await this.copyFile();
    await this.deleteFile();
  }
}