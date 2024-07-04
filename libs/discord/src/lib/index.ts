import { DiscordBot, DiscordBotNames } from '@shared/types';
import { aquinasBot, summaryBot } from './bots';

export const discordBots: Record<DiscordBotNames, DiscordBot> = {
  'aquinas-bot': aquinasBot,
  'summary-bot': summaryBot,
};
