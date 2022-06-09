import path from 'path';
import fs from 'fs';

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
      console.log('Operation failed');
    }
  }

  async deleteFile(isLog) {
    try {
      const pathToFile = this.state.getState().pathToFile;
      await fs.promises.rm(pathToFile);
      this.state.setState({ pathToFile: '' });
      console.log(isLog ? 'the file was successfully deleted' : '');
    } catch (error) { }
  }

  async renameFile(filename) {
    return new Promise((resolve, reject) => {
      const pathToFile = this.state.getState().pathToFile;

      console.log(path.parse(pathToFile).dir);
      const rs = fs.createReadStream(path.join(pathToFile));

      const ws = fs.createWriteStream(path.join(path.parse(pathToFile).dir, filename));
      rs.pipe(ws);

      rs.on('end', async () => {
        await this.deleteFile();
        resolve();
      });

      rs.on('error', () => {
        reject('Operation failed');
      });

    }).catch(() => {
      console.log('Operation failed')
    });
  }
}