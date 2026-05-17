import { spawn } from 'node:child_process';
import { getLatestLogFile } from '../storage/logs';

export function watchCommand() {
  const latestLog = getLatestLogFile();
  
  if (!latestLog) {
    console.error('No logs found. Run "minddiff gemini" first.');
    process.exit(1);
  }

  console.log(`-- MindDiff: Watching latest log: ${latestLog} --\n`);

  // Simple tail -f using child_process.spawn
  const tail = spawn('tail', ['-f', latestLog], {
    stdio: 'inherit'
  });

  tail.on('close', (code: number | null) => {
    process.exit(code ?? 0);
  });
}
