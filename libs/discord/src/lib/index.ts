import { DiscordBotClient, DiscordBotNames } from '@shared/types';
import { aquinasBot, summaryBot } from './bots';

export const discordBots: Record<DiscordBotNames, DiscordBotClient> = {
  'aquinas-bot': aquinasBot,
  'summary-bot': summaryBot,
};
