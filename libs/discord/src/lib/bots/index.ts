import { GatewayIntentBits } from 'discord.js';
import {
  AquinasCommandClient,
  createAquinasAppCtx,
  pingCommand,
  queryStCommand,
  querySCGCommand,
  searchCommand,
  helpCommand,
  events,
} from './aquinas-bot';

export const aquinasBot = {
  client: AquinasCommandClient,
  appCtxFactory: createAquinasAppCtx,
  commands: [
    pingCommand,
    queryStCommand,
    querySCGCommand,
    helpCommand,
    searchCommand,
  ],
  events,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};
