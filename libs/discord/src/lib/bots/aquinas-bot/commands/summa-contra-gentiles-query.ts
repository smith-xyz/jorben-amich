import { AttachmentBuilder } from 'discord.js';
import { SummaContraGentilesService } from '@service';
import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import path from 'path';
import { summaContraGentilesQuerySlashCommand } from '../slash-command-config';
import { parseSummaContraGentilesParams } from '../tools';

export const querySCGCommand: Command = {
  data: summaContraGentilesQuerySlashCommand,
  messageTrigger: (message: string) =>
    message.toLowerCase().startsWith('summa contra gentiles'),
  async execute(ctx: AquinasInteractionContext) {
    const {
      isSlashCommand,
      interaction,
      appCtx: { appVersion, appName, assetsDir },
    } = ctx;

    const parameters = parseSummaContraGentilesParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.debug('SCG EVENT ERROR: parameters missing');
      return;
    }

    try {
      const citation = SummaContraGentilesService.queryToCitation(parameters);

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

      const scgService = new SummaContraGentilesService(ctx.appCtx);
      const scgParagraph = await scgService.getSummaContraGentilesParagraph(
        parameters
      );

      if (!scgParagraph) {
        // on slash commands we can let the user know it wasn't found
        // need to fix how we're trying to do everything under one command
        if (isSlashCommand)
          await interaction.reply({
            embeds: [embed],
            files: [thomasIcon],
          });

        return;
      }

      embed.description = parameters.latin
        ? scgParagraph.latinParagraph.content
        : scgParagraph.content;

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
