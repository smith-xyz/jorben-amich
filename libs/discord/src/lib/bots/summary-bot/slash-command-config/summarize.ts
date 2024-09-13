import { SlashCommandBuilder } from 'discord.js';

export const summarizeSlashCommand = new SlashCommandBuilder()
  .setName('summarize')
  .setDescription('Summarize messages in this channel')
  .addNumberOption((option) =>
    option
      .setName('limit')
      .setDescription('Choose number of messages to summarize')
      .setRequired(true)
      .setMinValue(2)
      .setMaxValue(100)
  )
  .toJSON();
