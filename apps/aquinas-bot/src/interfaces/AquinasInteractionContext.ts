import { ChatInteraction } from '@shared/utilities';
import { AppCtx } from './AppCtx';

export interface AquinasInteractionContext {
  interaction: ChatInteraction;
  appCtx: AppCtx;
}
