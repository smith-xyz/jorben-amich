import { GatewayIntentBits } from 'discord.js';
import {
  pingCommand,
  querySCGCommand,
  queryStCommand,
  helpCommand,
  searchCommand,
  askThomasCommand,
} from './commands';
import { events } from './events';
import { DiscordBotClient } from '@shared/clients';
import { database } from '@database';
import { MemoryCache } from '@cache';
import { AquinasBotAppCtx, AquinasBotClient } from '@shared/types';
import { PathUtils } from '@shared/utilities';

export const aquinasBot: AquinasBotClient =
  new DiscordBotClient<AquinasBotAppCtx>({
    clientId: process.env.DISCORD_CLIENT_ID,
    token: process.env.DISCORD_TOKEN,
    commands: [
      pingCommand,
      queryStCommand,
      querySCGCommand,
      helpCommand,
      searchCommand,
      askThomasCommand,
    ],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    events,
    context: {
      appName: 'aquinas-bot',
      appVersion: process.env.APP_VERSION,
      assetsDir: PathUtils.resolveToCwd(process.env.ASSETS_DIR),
      databases: database['aquinas-bot'],
      cache: new MemoryCache(null, {
        ttl: 43200,
        expireCache: 86400,
        maxByteSize: 1000000,
        resizeStrategy: 'LARGEST',
      }),
    },
  });
