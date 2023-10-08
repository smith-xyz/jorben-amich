import { ChatInteraction } from '@shared/utilities';
import { AquinasBotAppCtx } from './AquinasAppCtx';

export interface AquinasInteractionContext {
  isSlashCommand: boolean;
  interaction: ChatInteraction;
  appCtx: AquinasBotAppCtx;
}
