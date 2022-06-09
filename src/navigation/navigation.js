import path from 'path';
import fs from 'fs';

export const errorOperationFailed = 'Operation failed';

export class Navigation {

  constructor(state) {
    this.state = state;
  }

  async moveToDir(pathToFolder, isDir) {
    try {
      const currentPathDir = this.state.getState().currentPathDir;
      const newPath = path.join(currentPathDir, pathToFolder ? pathToFolder : '..');

      const isValidPath = pathToFolder.includes(currentPathDir) || currentPathDir.includes(pathToFolder) || path.isAbsolute(pathToFolder);

      const folder = isValidPath ? (path.isAbsolute(pathToFolder) ? path.resolve(currentPathDir, pathToFolder) : pathToFolder) : newPath;


      if (isDir) {
        const isDirectory = await this.isDirectory(folder);

        if (!isDirectory) {
          throw new Error(errorOperationFailed);
        }

        this.state.setState({ currentPathDir: folder });
      } else {
        const isFile = await this.isFile(folder);

        if (!isFile) {
          throw new Error(errorOperationFailed);
        }

        this.state.setState({ pathToFile: folder });
      }

    } catch (error) {
      console.log(errorOperationFailed);
    }
  }

  async isDirectory(dir) {
    const stat = await fs.promises.stat(dir);
    return stat.isDirectory();
  }

  async isFile(dir) {
    const stat = await fs.promises.stat(dir);
    return stat.isFile();
  }
}