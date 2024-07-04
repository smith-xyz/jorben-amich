import { Client, ClientOptions, Collection } from 'discord.js';
import { Command, CommandClient } from '@shared/types';

export class DiscordCommandClient extends Client implements CommandClient {
  private readonly _commands: Collection<string, Command> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
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
}
