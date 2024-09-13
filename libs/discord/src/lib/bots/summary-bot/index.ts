import { GatewayIntentBits } from 'discord.js';
import { helpCommand as summaryBotHelp, summarizeCommand } from './commands';
import { SummaryBotClient } from './client';
import { createSummaryBotCtx } from './context';
import { events } from './events';

export const summaryBot = {
  client: SummaryBotClient,
  appCtxFactory: createSummaryBotCtx,
  commands: [summaryBotHelp, summarizeCommand],
  events,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
};
