import { createNewLogFile } from '../storage/logs';
import { createLogStream } from '../runtime/stream';
import { spawnWrapper } from '../runtime/spawn';

export async function geminiCommand(args: string[]) {
  const logPath = createNewLogFile();
  const logStream = createLogStream(logPath);
  
  console.log(`-- MindDiff: Starting Gemini (logging to ${logPath}) --\n`);
  
  const code = await spawnWrapper('gemini', args, logStream);
  
  if (code !== 0) {
    process.exit(code);
  }
}
