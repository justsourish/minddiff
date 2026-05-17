import { createWriteStream, WriteStream } from 'node:fs';

export function createLogStream(filePath: string): WriteStream {
  return createWriteStream(filePath, { flags: 'a' });
}
