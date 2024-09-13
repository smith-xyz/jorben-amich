import { Events, GatewayIntentBits, Partials } from 'discord.js';
import { discordBots } from '@discord';
import { SummaryBotAppCtx } from '@shared/types';
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

const { appCtxFactory, client, commands, events, intents } =
  discordBots['summary-bot'];

const discordOptions = {
  intents,
};

appCtxFactory().then(start);

function start(appCtx: SummaryBotAppCtx) {
  const summaryBotCommandClient = new client({
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
    summaryBotCommandClient.addCommand(command.data.name, command);
  }

  console.log('Initializing Events');
  for (const eventType of Object.keys(events)) {
    summaryBotCommandClient.on(
      eventType,
      async (interaction) =>
        await events[eventType](summaryBotCommandClient, interaction)
    );
  }
  console.log('Events intialized');

  summaryBotCommandClient.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  summaryBotCommandClient.login(process.env.DISCORD_TOKEN);
}
