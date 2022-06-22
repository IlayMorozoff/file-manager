import url from 'url';
import path from 'path';

export function getDirname(importMetaUrl) {
  const __filename = url.fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);

  return {
    __filename,
    __dirname,
  }
};