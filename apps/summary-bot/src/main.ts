import { discordBots } from '@discord';
import { EnvUtils } from '@shared/utilities';

console.log('STARTING SUMMARY BOT');
console.log('Validating Environment Variables are set');

EnvUtils.envVariableValidator([
  'APP_VERSION',
  'ASSETS_DIR',
  'DISCORD_TOKEN',
  'DISCORD_CLIENT_ID',
  'GOOGLE_AI_API_KEY',
]);

const summaryBot = discordBots['summary-bot'];

(async () => await summaryBot.init())();
