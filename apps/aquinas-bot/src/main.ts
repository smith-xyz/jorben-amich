import { Events } from 'discord.js';
import { discordBots } from '@discord';
import { AquinasBotAppCtx } from '@shared/types';

console.log('STARTING THOMAS AQUINAS BOT');
console.log('Validating Environment Variables are set');

const missing = [
  'APP_VERSION',
  'ASSETS_DIR',
  'DISCORD_TOKEN',
  'DISCORD_CLIENT_ID',
  'DB_CONFIG_FILE',
].filter(
  (variable) =>
    !process.env[variable] ||
    (typeof process.env[variable] === 'string' &&
      process.env[variable].length === 0)
);

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(',')}`);
}

const { appCtxFactory, client, commands, events, intents } =
  discordBots['aquinas-bot'];

const discordOptions = {
  intents,
};

appCtxFactory().then(start);

function start(appCtx: AquinasBotAppCtx) {
  const aquinasCommandClient = new client({
    discordOptions,
    appCtx,
  });

  for (const command of commands) {
    if (!command.data || !command.execute) {
      console.log(
        `[WARNING] The command at ${command.data.name} is missing a required "data" or "execute" property.`
      );
      continue;
    }
    aquinasCommandClient.addCommand(command.data.name, command);
  }

  console.log('Initializing Events');
  for (const eventType of Object.keys(events)) {
    aquinasCommandClient.on(
      eventType,
      async (interaction) =>
        await events[eventType](aquinasCommandClient, interaction)
    );
  }
  console.log('Events intialized');

  aquinasCommandClient.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  aquinasCommandClient.login(process.env.DISCORD_TOKEN);
}
