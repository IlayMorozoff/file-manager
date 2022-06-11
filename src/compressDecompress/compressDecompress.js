import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { errorOperationFailed } from '../navigation/navigation.js';

export class CompressDecompress {
  constructor(state) {
    this.state = state;
  }

  async compressFile() {
    try {
      const pathToFile = this.state.getState().pathToFile;
      const pathToDestination = this.state.getState().pathToNewDir;

      const rs = fs.createReadStream(pathToFile);

      const ws = fs.createWriteStream(path.join(pathToDestination, `${path.parse(pathToFile).base}.br`));

      const brotli = zlib.createBrotliCompress();

      await pipeline(rs, brotli, ws);
    } catch (error) {
      console.log(error ? '' : errorOperationFailed)
    }
  }

  async decompressFile() {
    try {
      const pathToFile = this.state.getState().pathToFile;
      const pathToDestination = this.state.getState().pathToNewDir;

      const rs = fs.createReadStream(pathToFile);

      const parsedFilename = path.parse(pathToFile).base.split('.').filter((_, i, arr) => i !== arr.length - 1);

      const ws = fs.createWriteStream(path.join(pathToDestination, `${parsedFilename.join('.')}`));

      const brotli = zlib.createBrotliDecompress();

      await pipeline(rs, brotli, ws);
    } catch (error) {
      console.log(error ? '' : errorOperationFailed)
    }
  }
}