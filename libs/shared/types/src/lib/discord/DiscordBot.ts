import {
  Client,
  ClientOptions,
  Events,
  GatewayIntentBits,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import { SummaryBotAppName } from '../apps';
import { AquinasBotAppName } from '../apps/aquinas-bot';
import { AppCtx } from '../common';
import { ChatInteraction } from '@shared/utilities';

export interface DiscordBotConfig {
  token: string;
  clientId: string;
  guildId?: string;
}

export type DiscordBotConfigMap<TAppNames extends string | number | symbol> =
  Record<TAppNames, DiscordBotConfig>;

export type DiscordBotNames = AquinasBotAppName | SummaryBotAppName;

export interface CommandClient extends Client {
  get commands(): Array<Command>;
  getCommandByKey: (command: string) => Command;
  getCommandByMessageTrigger: (message: string) => Command;
  addCommand: (key: string, command: Command) => void;
}

export interface Command {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  messageTrigger?: (message: string) => boolean;
  execute: (...args: unknown[]) => Promise<void>;
}

export type Event = Readonly<{
  [key in Events]?: (...args: unknown[]) => Promise<void> | void;
}>;

interface DiscordCommandClientConstructor {
  new ({
    discordOptions,
    appCtx,
  }: {
    discordOptions: ClientOptions;
    appCtx: AppCtx;
  }): CommandClient;
}

export interface DiscordBot {
  client: DiscordCommandClientConstructor;
  appCtxFactory: () => Promise<AppCtx>;
  commands: Command[];
  events: Event;
  intents: GatewayIntentBits[];
}

export interface InteractionContext<T = AppCtx> {
  isSlashCommand: boolean;
  interaction: ChatInteraction;
  appCtx: T;
}
