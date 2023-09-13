import { DiscordCommandClient } from '@shared/clients';
import { ClientOptions } from 'discord.js';
import { AppCtx } from '../interfaces/AppCtx';

export class AquinasCommandClient extends DiscordCommandClient {
  public appCtx: AppCtx;

  constructor({
    discordOptions,
    appCtx,
  }: {
    discordOptions: ClientOptions;
    appCtx: AppCtx;
  }) {
    super(discordOptions);
    this.appCtx = appCtx;
  }
}
