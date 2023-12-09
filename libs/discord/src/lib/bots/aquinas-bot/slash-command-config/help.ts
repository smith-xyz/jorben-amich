import { SlashCommandBuilder } from 'discord.js';

export const helpSlashCommand = new SlashCommandBuilder()
  .setName('aquinasbot')
  .setDescription('Help command.')
  .toJSON();
