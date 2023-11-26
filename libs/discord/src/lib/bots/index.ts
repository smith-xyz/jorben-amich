import { GatewayIntentBits } from 'discord.js';
import {
  AquinasCommandClient,
  createAquinasAppCtx,
  pingCommand,
  queryStCommand,
  querySCGCommand,
  events,
} from './aquinas-bot';

export const aquinasBot = {
  client: AquinasCommandClient,
  appCtxFactory: createAquinasAppCtx,
  commands: [pingCommand, queryStCommand, querySCGCommand],
  events,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};
