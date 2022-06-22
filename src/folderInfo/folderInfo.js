import fs from 'fs';
import { errorOperationFailed } from '../navigation/navigation.js'

export class FolderInfo {
  constructor(state) {
    this.state = state;
  }

  async showInfo() {
    try {
      const pathToCurrentFolder = this.state.getState().currentPathDir;
      const filesAndFoldes = await fs.promises.readdir(pathToCurrentFolder);
      for (let el of filesAndFoldes) {
        console.log(el);
      }
    } catch (error) {
      console.log(errorOperationFailed);
    }
  }
}