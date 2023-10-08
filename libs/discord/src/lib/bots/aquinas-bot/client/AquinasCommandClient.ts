import { DiscordCommandClient } from '@shared/clients';
import { ClientOptions } from 'discord.js';
import { AquinasBotAppCtx } from '@shared/types';

export class AquinasCommandClient extends DiscordCommandClient {
  public appCtx: AquinasBotAppCtx;

  constructor({
    discordOptions,
    appCtx,
  }: {
    discordOptions: ClientOptions;
    appCtx: AquinasBotAppCtx;
  }) {
    super(discordOptions);
    this.appCtx = appCtx;
  }
}
