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

  async moveToDir(currentPathDir) {
    try {
      await fs.promises.access(currentPathDir, fs.constants.R_OK || fs.constants.W_OK);
      this.state.setState({ currentPathDir });
    } catch (error) {
      console.log('operation failed')
    }
  }
}