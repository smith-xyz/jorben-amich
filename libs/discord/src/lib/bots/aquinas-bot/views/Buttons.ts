import { ButtonBuilder, ButtonStyle } from 'discord.js';

export const BackButton = new ButtonBuilder()
  .setCustomId('back-button')
  .setStyle(ButtonStyle.Danger)
  .setLabel('Back');

export const NextButton = new ButtonBuilder()
  .setCustomId('next-button')
  .setStyle(ButtonStyle.Danger)
  .setLabel('Next');
