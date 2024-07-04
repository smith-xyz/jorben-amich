import { SlashCommandBuilder } from 'discord.js';

export const helpSlashCommand = new SlashCommandBuilder()
  .setName('summarybot')
  .setDescription('Help command.')
  .toJSON();
