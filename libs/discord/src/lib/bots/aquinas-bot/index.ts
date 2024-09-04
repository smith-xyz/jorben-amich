import { GatewayIntentBits } from 'discord.js';
import { AquinasCommandClient } from './client';
import { createAquinasAppCtx } from './context';
import {
  pingCommand,
  querySCGCommand,
  queryStCommand,
  helpCommand,
  searchCommand,
  askThomasCommand,
} from './commands';
import { events } from './events';
import { DiscordBot } from '@shared/types';

export const aquinasBot: DiscordBot = {
  client: AquinasCommandClient,
  appCtxFactory: createAquinasAppCtx,
  commands: [
    pingCommand,
    queryStCommand,
    querySCGCommand,
    helpCommand,
    searchCommand,
    askThomasCommand,
  ],
  events,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};
