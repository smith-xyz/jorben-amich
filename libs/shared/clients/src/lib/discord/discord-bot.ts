import {
  AppCtx,
  Command,
  DiscordBotClient as IDiscordBotClient,
  DiscordBotConfig,
} from '@shared/types';
import { Client, Collection, Events } from 'discord.js';
import { TypeUtils } from '@shared/utilities';

export class DiscordBotClient<T extends AppCtx>
  extends Client
  implements IDiscordBotClient<T>
{
  private readonly _commands: Collection<string, Command> = new Collection();

  public constructor(private readonly config: DiscordBotConfig<T>) {
    super({ intents: config.intents });
  }

  public get context() {
    return this.config.context;
  }

  public getCommandByKey(command: string) {
    return this._commands.get(command);
  }

  public getCommandByMessageTrigger(message: string) {
    for (const [, command] of this._commands.entries()) {
      if (command.messageTrigger && command.messageTrigger(message))
        return command;
    }
  }

  public addCommand(key: string, command: Command) {
    this._commands.set(key, command);
  }

  public get commands() {
    return Array.from(this._commands.values());
  }

  public async init() {
    const { commands, events, token, context } = this.config;

    for (const command of commands) {
      if (!command.data || !command.execute) {
        console.log(
          `[WARNING] The command at ${command.data.name} is missing a required "data" or "execute" property.`
        );
        continue;
      }
      this.addCommand(command.data.name, command);
    }

    console.log('Initializing databases');
    const dbKeys = TypeUtils.getTypedKeys(context.databases ?? {});
    await Promise.all(
      dbKeys.map((dbKey) => context.databases[dbKey].initialize())
    );

    console.log('Initializing Events');
    for (const eventType of Object.keys(events)) {
      this.on(
        eventType,
        async (interaction) => await events[eventType](this, interaction)
      );
    }
    console.log('Events intialized');

    this.once(Events.ClientReady, (c) => {
      console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    this.login(token);
  }
}
