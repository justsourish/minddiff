import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function getLogDirectory(): string {
  const dir = join(process.cwd(), 'minddiff', 'logs');
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function createNewLogFile(): string {
  const dir = getLogDirectory();
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  return join(dir, `${timestamp}-session.log`);
}

export function getLatestLogFile(): string | null {
  const dir = getLogDirectory();
  const files = readdirSync(dir)
    .filter(f => f.endsWith('.log'))
    .map(f => ({
      name: f,
      path: join(dir, f),
      mtime: statSync(join(dir, f)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0].path : null;
}
