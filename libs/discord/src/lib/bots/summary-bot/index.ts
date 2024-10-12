import { GatewayIntentBits } from 'discord.js';
import { helpCommand as summaryBotHelp, summarizeCommand } from './commands';
import { events } from './events';
import { MemoryCache } from '@cache';
import { DiscordBotClient } from '@shared/clients';
import { PathUtils } from '@shared/utilities';

export const summaryBot = new DiscordBotClient({
  clientId: process.env.DISCORD_CLIENT_ID,
  token: process.env.DISCORD_TOKEN,
  commands: [summaryBotHelp, summarizeCommand],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  events,
  context: {
    appName: 'summary-bot',
    appVersion: process.env.APP_VERSION,
    assetsDir: PathUtils.resolveToCwd(process.env.ASSETS_DIR),
    databases: null,
    cache: new MemoryCache(null, {
      ttl: 43200,
      expireCache: 86400,
      maxByteSize: 1000000,
      resizeStrategy: 'LARGEST',
    }),
  },
});
