import fs from 'fs';
import crypto from 'crypto';
import { errorOperationFailed } from '../navigation/navigation.js';


export class HashCalculator {
  constructor(state) {
    this.state = state;
  }

  async calculateHash() {
    return new Promise((res, rej) => {
      const pathToFile = this.state.getState().pathToFile;

      const rs = fs.createReadStream(pathToFile);

      let hash = '';

      rs.on('data', (data) => {
        hash += crypto.createHash('sha256').update(data).digest('hex');
      })

      rs.on('end', () => {
        console.log(hash);
        res()
      })
    }).catch((error) => {
      console.log(error ? '' : errorOperationFailed);
    })
  }
}