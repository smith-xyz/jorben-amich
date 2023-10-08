import { AttachmentBuilder } from 'discord.js';
import { QuerySummaTheologicaService, SummaTheologicaBuilder } from '@service';
import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import { parseSummaTheologicaParams } from '../tools';
import path from 'path';
import { summaTheologicaQuerySlashCommand } from '../slash-command-config';

export const queryStCommand: Command = {
  data: summaTheologicaQuerySlashCommand,
  messageTrigger: (message: string) =>
    message.toLowerCase().startsWith('summa theologica'),
  async execute(ctx: AquinasInteractionContext) {
    const {
      isSlashCommand,
      interaction,
      appCtx: { appVersion, appName, assetsDir },
    } = ctx;

    const parameters = parseSummaTheologicaParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.debug('ST EVENT ERROR: parameters missing');
      return;
    }

    try {
      const citation = SummaTheologicaBuilder.buildStCitation(parameters);

      const thomasIcon = new AttachmentBuilder(
        path.join(assetsDir, `/thumbnails/thomas-icon.png`)
      );

      const embed = {
        title: citation,
        color: 10038562,
        description: `Hmm...do not remember writing that one.`,
        footer: {
          text: `${appName} ${appVersion}`,
        },
        thumbnail: {
          url: `attachment://thomas-icon.png`,
        },
      };

      const stService = new QuerySummaTheologicaService(ctx.appCtx);
      const stEntry = await stService.getSummaTheologicaEntry(parameters);

      if (!stEntry || !stEntry.content) {
        // on slash commands we can let the user know it wasn't found
        // need to fix how we're trying to do everything under one command
        if (isSlashCommand)
          await interaction.reply({
            embeds: [embed],
            files: [thomasIcon],
          });

        return;
      }

      embed.description = stEntry.content;

      await interaction.reply({
        embeds: [embed],
        files: [thomasIcon],
      });
    } catch (err) {
      console.error('SERVICE ERROR: ', err.message);
      // For now - ignoring and not providing feedback on why but its typically formatting of the citation
    }
  },
};
