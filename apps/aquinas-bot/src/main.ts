import { Events, GatewayIntentBits } from 'discord.js';
import path from 'path';
import { dynamicModuleLoader } from '@shared/utilities';
import { AquinasCommandClient } from './client';
import { events } from './events';
import { Command } from '@shared/clients';
import fs from 'fs';

const appName = 'AquinasBot';
const appVersion = '0.1.0-beta.0';

console.log('STARTING THOMAS AQUINAS BOT');

const assetsDir = path.join(process.cwd(), process.env.ASSETS_DIR);

console.log('assets directory: ', assetsDir);

if (!fs.existsSync(assetsDir)) {
  throw Error(
    `Unable to start bot - assets folder does not exist at ${assetsDir}`
  );
}

const discordOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};

const appCtx = {
  appName,
  appVersion,
  assetsDir,
};

const aquinasCommandClient = new AquinasCommandClient({
  discordOptions,
  appCtx,
});

const commandsPath = path.join(__dirname, 'commands');
const commandModules = dynamicModuleLoader<Command>(commandsPath);

for (const command of commandModules) {
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
