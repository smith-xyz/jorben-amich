import { GatewayIntentBits } from 'discord.js';
import {
  AquinasCommandClient,
  createAquinasAppCtx,
  pingCommand,
  queryStCommand,
  events,
} from './aquinas-bot';

export const aquinasBot = {
  client: AquinasCommandClient,
  appCtxFactory: createAquinasAppCtx,
  commands: [pingCommand, queryStCommand],
  events,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};
