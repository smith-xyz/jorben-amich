import { GatewayIntentBits } from 'discord.js';
import {
  AquinasCommandClient,
  createAquinasAppCtx,
  pingCommand,
  queryStCommand,
  querySCGCommand,
  helpCommand,
  events,
} from './aquinas-bot';

export const aquinasBot = {
  client: AquinasCommandClient,
  appCtxFactory: createAquinasAppCtx,
  commands: [pingCommand, queryStCommand, querySCGCommand, helpCommand],
  events,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};
