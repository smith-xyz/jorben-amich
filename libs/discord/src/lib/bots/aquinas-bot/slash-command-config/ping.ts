import { SlashCommandBuilder } from 'discord.js';

export const pingSlashCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Make sure the good doctor can answer your requests!')
  .toJSON();
