import { messageCreate } from './messageCreate';
import { interactionCreate } from './interactionCreate';
import { Events } from 'discord.js';

export const events: Readonly<{
  [key in Events]?: (...args: unknown[]) => Promise<void> | void;
}> = Object.freeze({
  [Events.MessageCreate]: messageCreate,
  [Events.InteractionCreate]: interactionCreate,
});
