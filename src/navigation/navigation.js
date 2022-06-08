import path from 'path';
import fs from 'fs';

export class Navigation {

  constructor(state) {
    this.state = state;
  }

  upToPath() {
    const currentPathDir = this.state.getState().currentPathDir;
    const newPath = currentPathDir.split(path.sep);

    newPath.pop();

    this.state.setState({ currentPathDir: newPath.join(path.sep) });

    if (newPath.length === 1) {
      this.state.setState({ currentPathDir: `${newPath.join(path.sep)}${path.sep}` });
    }
  }

  getAbsoluteUpPath(destination) {
    let levels;

    if (destination.includes(path.sep)) {
      levels = destination.split(path.sep).filter((level) => level === '..');
    } else {
      levels = destination.split(`/`).filter((level) => level === '..');
    }

    for (let i = 0; i < levels.length; i++) {
      this.upToPath();
    }

    const dir = this.state.getState().currentPathDir.split(path.sep).filter((item) => !!item);

    if (dir.length === 1) {
      // TODO: ERROR OR RETURN?
      // throw new Error('boom');
      return;
    }
  }

  getRelativePath(pathToFolder) {
    const dir = this.state.getState().currentPathDir;

    let data;

    if (pathToFolder.startsWith('./')) {
      data = pathToFolder.replace('./', '');
    } else if ( pathToFolder.startsWith(`.${path.sep}`)){
      data = pathToFolder.replace(`.${path.sep}`, '');
    }

    console.log(data, 'data')

    const newPath = path.join(dir, pathToFolder);

    console.log(newPath, 'newPath')

  }

  async moveToDir(currentPathDir) {
    try {

      if ((currentPathDir.startsWith('../') || currentPathDir.startsWith(`..${path.sep}`)) && currentPathDir !== '..') {
        this.getAbsoluteUpPath(currentPathDir);
        return;
      } else {
        this.getRelativePath(currentPathDir);
        // return;
      }

      switch (currentPathDir) {
        case '..':
          this.upToPath();
          break;
        default:
          this.state.setState({ currentPathDir });
          break;
      }

      const pathToFolder = this.state.getState().currentPathDir

      const stat = await fs.promises.stat(pathToFolder);

      // console.log(dir)
      // // await fs.promises.access(currentPathDir, fs.constants.R_OK || fs.constants.W_OK);

    } catch (error) {
      console.log('Operation failed');
    }
  }

  async isExistsFolder() {
    const dir = this.state.getState().currentPathDir;
    const stat = await fs.promises.stat(dir);
    // console.log(stat, stat)
  }


}