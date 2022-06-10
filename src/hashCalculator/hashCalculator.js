import fs from 'fs';
import crypto from 'crypto';
import { pipeline } from 'stream/promises';
import { errorOperationFailed } from '../navigation/navigation.js';


export class HashCalculator {
  constructor(state) {
    this.state = state;
  }

  async calculateHash() {
    try {
      const currentPathDir = this.state.getState().pathToFile;

      const rs = fs.createReadStream(currentPathDir);
      const ws = process.stdout;
  
      const hash = crypto.createHash('sha256').setEncoding('hex');
      await pipeline(rs, hash, ws);
    } catch (error) {
      console.log(error ? '' : errorOperationFailed);
    }
  }
}