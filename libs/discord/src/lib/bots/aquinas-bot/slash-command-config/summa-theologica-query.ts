import { SlashCommandBuilder } from 'discord.js';

export const summaTheologicaQuerySlashCommand = new SlashCommandBuilder()
  .setName('st')
  .setDescription(
    'Query Summa Theologica. Example usage, /st [part] II-II [question] 23 [article] 3 [subsection] ad. 1'
  )
  .addStringOption((option) =>
    option
      .setName('part')
      .setDescription('choose a part')
      .setRequired(true)
      .setChoices(
        { name: 'First Part (Prima Pars)', value: 'I' },
        {
          name: 'First Part of the Second Part (Prima Secundæ Partis)',
          value: 'I-II',
        },
        {
          name: 'Second Part of the Second Part (Secunda Secundæ Partis)',
          value: 'II-II',
        },
        { name: 'Third Part (Tertia Pars)', value: 'III' }
      )
  )
  .addNumberOption((option) =>
    option
      .setName('question')
      .setDescription('choose a question')
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName('article')
      .setDescription('choose an article')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('subsection')
      .setDescription(
        'specific article subsection, default is co. (I answer that)'
      )
      .setRequired(false)
      .setChoices(
        { name: 'Objections', value: 'arg.' },
        {
          name: 'Rebuttal',
          value: 's. c.',
        },
        {
          name: 'Answer',
          value: 'co.',
        },
        { name: 'Replies to Objections', value: 'ad.' }
      )
  )
  .addNumberOption((option) =>
    option
      .setName('subsection-number')
      .setDescription('choose which reply or objection')
      .setRequired(false)
  )
  .toJSON();
