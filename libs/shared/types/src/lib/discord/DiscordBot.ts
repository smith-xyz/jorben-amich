import {
  Events,
  GatewayIntentBits,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import { SummaryBotAppName } from '../apps';
import { AquinasBotAppName } from '../apps/aquinas-bot';
import { AppCtx } from '../common';
import { ChatInteraction } from '@shared/utilities';

export interface DiscordBotConfig<T = AppCtx> {
  token: string;
  clientId: string;
  guildId?: string;
  commands: Command[];
  intents: GatewayIntentBits[];
  events: Event;
  context: T;
}

export type DiscordBotConfigMap<TAppNames extends string | number | symbol> =
  Record<TAppNames, DiscordBotConfig>;

export type DiscordBotNames = AquinasBotAppName | SummaryBotAppName;

export interface Command {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  messageTrigger?: (message: string) => boolean;
  execute: (...args: unknown[]) => Promise<void>;
}

export type Event = Readonly<{
  [key in Events]?: (...args: unknown[]) => Promise<void> | void;
}>;

export interface DiscordBotClient<Ctx = AppCtx> {
  init: () => Promise<void>;
  get context(): Ctx;
  get commands(): Array<Command>;
  getCommandByKey: (command: string) => Command;
  getCommandByMessageTrigger: (message: string) => Command;
  addCommand: (key: string, command: Command) => void;
}

export interface InteractionContext<T = DiscordBotClient<AppCtx>> {
  isSlashCommand: boolean;
  interaction: ChatInteraction;
  client: T;
}
