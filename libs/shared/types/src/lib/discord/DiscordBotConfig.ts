import { AquinasBotAppName } from '../aquinas-bot';

export interface DiscordBotConfig {
  token: string;
  clientId: string;
  guildId?: string;
}

export type DiscordBotConfigMap<TAppNames extends string | number | symbol> =
  Record<TAppNames, DiscordBotConfig>;

export type DiscordBotNames = AquinasBotAppName;
