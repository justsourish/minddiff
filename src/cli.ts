#!/usr/bin/env node
import { geminiCommand } from './commands/gemini';
import { watchCommand } from './commands/watch';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const remainingArgs = args.slice(1);

  switch (command) {
    case 'gemini':
      await geminiCommand(remainingArgs);
      break;
    case 'watch':
      watchCommand();
      break;
    default:
      console.log('MindDiff V1 Prototype');
      console.log('Usage:');
      console.log('  minddiff gemini [args...]  - Launch Gemini CLI with interception');
      console.log('  minddiff watch             - Tail the latest capture log');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('MindDiff Error:', err);
  process.exit(1);
});
