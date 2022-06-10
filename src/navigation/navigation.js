import path from 'path';
import fs from 'fs';

export const errorOperationFailed = 'Operation failed';

export class Navigation {

  constructor(state) {
    this.state = state;
  }

  getPath(pathToFolder) {
    const currentPathDir = this.state.getState().currentPathDir;
    const newPath = path.join(currentPathDir, pathToFolder ? pathToFolder : '..');

    const isValidPath = pathToFolder.includes(currentPathDir) || currentPathDir.includes(pathToFolder) || path.isAbsolute(pathToFolder);

    const folder = isValidPath ? (path.isAbsolute(pathToFolder) ? path.join(path.parse(process.cwd()).root, pathToFolder) : pathToFolder) : newPath;

    return folder;
  }

  async moveToDir(pathToFolder, isDir, isNewPathToFolder) {
    try {

      const folder = this.getPath(pathToFolder);

      if (isDir && !isNewPathToFolder) {
        const isDirectory = await this.isDirectory(folder);

        if (!isDirectory) {
          throw new Error(errorOperationFailed);
        }

        this.state.setState({ currentPathDir: folder });
      } else if (!isDir && !isNewPathToFolder) {
        const isFile = await this.isFile(folder);

        if (!isFile) {
          throw new Error(errorOperationFailed);
        }

        this.state.setState({ pathToFile: folder });
      } else {
        const pathToNewDir = this.getPath(pathToFolder);
        const isDirectory = await this.isDirectory(pathToNewDir);

        if (!isDirectory) {
          throw new Error(errorOperationFailed);
        }
        this.state.setState({ pathToNewDir });
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