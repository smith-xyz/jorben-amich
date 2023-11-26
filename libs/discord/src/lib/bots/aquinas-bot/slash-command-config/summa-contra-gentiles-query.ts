import { SlashCommandBuilder } from 'discord.js';

export const summaContraGentilesQuerySlashCommand = new SlashCommandBuilder()
  .setName('scg')
  .setDescription(
    'Query Summa Contra Gentiles. Example usage, /scg [Book] 1 [Chapter] 23 [Paragraph] 3'
  )
  .addNumberOption((option) =>
    option
      .setName('book')
      .setDescription('choose a book')
      .setRequired(true)
      .setChoices(
        { name: 'Book I: God', value: 1 },
        {
          name: 'Book II: Creation',
          value: 2,
        },
        {
          name: 'Book III: Providence',
          value: 3,
        },
        { name: 'Book IV: Salvation', value: 4 }
      )
  )
  .addNumberOption((option) =>
    option
      .setName('chapter')
      .setDescription('choose a chapter')
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName('paragraph')
      .setDescription('choose a paragraph')
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName('latin')
      .setDescription('returns paragraph in latin')
      .setRequired(false)
  )
  .toJSON();
