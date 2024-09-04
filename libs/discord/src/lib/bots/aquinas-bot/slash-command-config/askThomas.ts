import { SlashCommandBuilder } from 'discord.js';

export const askThomasSlashCommand = new SlashCommandBuilder()
  .setName('askthomas')
  .setDescription('Ask Saint Thomas Aquinas anything')
  .addStringOption((option) =>
    option
      .setName('question')
      .setDescription('Provide question')
      .setRequired(true)
  )
  .toJSON();
