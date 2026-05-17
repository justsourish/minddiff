import * as pty from 'node-pty';
import { WriteStream } from 'node:fs';

export function spawnWrapper(command: string, args: string[], logStream: WriteStream): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      // Create the pseudo-terminal
      // We spawn the command directly rather than through a shell to avoid escaping issues
      const ptyProcess = pty.spawn(command, args, {
        name: 'xterm-color',
        cols: process.stdout.columns || 80,
        rows: process.stdout.rows || 24,
        cwd: process.cwd(),
        env: process.env as { [key: string]: string }
      });

      // Enable raw mode for stdin to forward all keys (arrows, Ctrl+C, etc.)
      const isRaw = process.stdin.isRaw;
      if (process.stdin.setRawMode) {
        process.stdin.setRawMode(true);
      }

      // Forward stdin to the PTY
      const onStdinData = (data: Buffer) => {
        ptyProcess.write(data.toString());
      };
      process.stdin.on('data', onStdinData);

      // Capture PTY output
      ptyProcess.onData((data) => {
        process.stdout.write(data);
        logStream.write(data);
      });

      // Handle window resize
      const onResize = () => {
        ptyProcess.resize(process.stdout.columns || 80, process.stdout.rows || 24);
      };
      process.stdout.on('resize', onResize);

      // Handle process exit
      ptyProcess.onExit(({ exitCode }) => {
        // Restore terminal state
        process.stdout.removeListener('resize', onResize);
        process.stdin.removeListener('data', onStdinData);
        if (process.stdin.setRawMode) {
          process.stdin.setRawMode(isRaw);
        }
        
        logStream.end();
        resolve(exitCode);
      });

      // Handle wrapper termination
      const onSignal = () => {
        ptyProcess.kill();
      };
      process.on('SIGINT', onSignal);
      process.on('SIGTERM', onSignal);
    } catch (err) {
      reject(err);
    }
  });
}
