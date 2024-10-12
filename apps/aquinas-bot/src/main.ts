import { discordBots } from '@discord';
import { EnvUtils } from '@shared/utilities';

console.log('STARTING THOMAS AQUINAS BOT');
console.log('Validating Environment Variables are set');

EnvUtils.envVariableValidator([
  'APP_VERSION',
  'ASSETS_DIR',
  'DISCORD_TOKEN',
  'DISCORD_CLIENT_ID',
  'DB_CONFIG_FILE',
  'GOOGLE_AI_API_KEY',
]);

const aquinasBot = discordBots['aquinas-bot'];

(async () => await aquinasBot.init())();
