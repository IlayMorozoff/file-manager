import path from 'path';
import fs from 'fs';

const errorOperationFailed = 'Operation failed';

export class Navigation {

  constructor(state) {
    this.state = state;
  }

  async moveToDir(pathToFolder) {
    try {
      const currentPathDir = this.state.getState().currentPathDir;
      const newPath = path.join(currentPathDir, pathToFolder ? pathToFolder : '..');

      const folder = pathToFolder.includes(currentPathDir) || currentPathDir.includes(pathToFolder) ? pathToFolder : newPath;

      const isDirectory = await this.isDirectory(folder);

      if (!isDirectory) {
        throw new Error(errorOperationFailed);
      }

      this.state.setState({ currentPathDir: folder });
    } catch (error) {
      console.log(errorOperationFailed);
    }
  }

  async isDirectory(dir) {
    const stat = await fs.promises.stat(dir);
    return stat.isDirectory();
  }
}