import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { QuerySummaTheologicaService } from '../services';
import { Command } from '@shared/clients';
import { AquinasInteractionContext, SummaTheologicaQuery } from '../interfaces';
import { buildSummaTheologicaParams } from '../builders';
import path from 'path';

module.exports = {
  data: new SlashCommandBuilder()
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
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('choose a question')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('article')
        .setDescription('choose an article')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('subsection')
        .setDescription('specific subsection, default is co. (I answer that)')
    ),
  messageTrigger: (message: string) =>
    message.toLowerCase().startsWith('summa theologica'),
  async execute(ctx: AquinasInteractionContext) {
    const {
      interaction,
      appCtx: { assetsDir, appVersion, appName },
    } = ctx;

    const parameters = buildSummaTheologicaParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.error('ST EVENT ERROR: parameters missing');
      return;
    }

    try {
      const { part, question, article, subsection } = parameters;
      const stService = new QuerySummaTheologicaService(assetsDir);
      const stEntry = await stService.getSummaTheologicaEntry(parameters);

      const thomasIcon = new AttachmentBuilder(
        path.join(assetsDir, `/thumbnails/thomas-icon.png`)
      );

      await interaction.reply({
        embeds: [
          {
            title: `ST ${part}, Q. ${question}, Art. ${article}, ${subsection}`,
            color: 10038562,
            description: stEntry.replaceAll('\n', ''),
            footer: {
              text: `${appName} ${appVersion}`,
            },
            thumbnail: {
              url: `attachment://thomas-icon.png`,
            },
          },
        ],
        files: [thomasIcon],
      });
    } catch (err) {
      console.error('SERVICE ERROR: ', err.message);
      // For now - ignoring and not providing feedback on why but its typically formatting of the citation
    }
  },
} as Command;
