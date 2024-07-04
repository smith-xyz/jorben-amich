import { DiscordCommandClient } from '@shared/clients';
import { ClientOptions } from 'discord.js';
import { SummaryBotAppCtx } from '@shared/types';

export class SummaryBotClient extends DiscordCommandClient {
  public appCtx: SummaryBotAppCtx;

  constructor({
    discordOptions,
    appCtx,
  }: {
    discordOptions: ClientOptions;
    appCtx: SummaryBotAppCtx;
  }) {
    super(discordOptions);
    this.appCtx = appCtx;
  }
}
