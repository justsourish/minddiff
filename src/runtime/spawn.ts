import { spawn } from 'node:child_process';
import { WriteStream } from 'node:fs';

export function spawnWrapper(command: string, args: string[], logStream: WriteStream): Promise<number> {
  return new Promise((resolve) => {
    // We use 'inherit' for stdin so user interaction works.
    // We use 'pipe' for stdout and stderr to intercept and log them.
    const child = spawn(command, args, {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });

    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
      logStream.write(data);
    });

    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
      logStream.write(data);
    });

    child.on('close', (code) => {
      logStream.end();
      resolve(code ?? 0);
    });

    // Handle process interruption
    process.on('SIGINT', () => {
      child.kill('SIGINT');
    });
  });
}
