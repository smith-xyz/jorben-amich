import { SummaContraGentilesService } from '@service';
import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import { summaContraGentilesQuerySlashCommand } from '../slash-command-config';
import { parseSummaContraGentilesParams } from '../tools';
import { createBaseInteractionReply } from '../views';

export const querySCGCommand: Command = {
  data: summaContraGentilesQuerySlashCommand,
  async execute(ctx: AquinasInteractionContext) {
    const { isSlashCommand, interaction } = ctx;

    const parameters = parseSummaContraGentilesParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.debug('SCG EVENT ERROR: parameters missing');
      return;
    }

    try {
      const citation = SummaContraGentilesService.buildCitation(parameters);

      const replyOptions = createBaseInteractionReply({
        ctx,
        title: citation,
        description: 'Hmm...do not remember writing that one.',
      });

      const scgService = new SummaContraGentilesService(ctx.appCtx);
      const scgParagraph = await scgService.getSummaContraGentilesParagraph(
        parameters
      );

      if (!scgParagraph) {
        // on slash commands we can let the user know it wasn't found
        // need to fix how we're trying to do everything under one command
        if (isSlashCommand) await interaction.reply(replyOptions);
        return;
      }

      replyOptions.embeds[0].setDescription(
        parameters.latin
          ? scgParagraph.latinParagraph.content
          : scgParagraph.content
      );

      await interaction.reply(replyOptions);
    } catch (err) {
      console.error('SERVICE ERROR: ', err.message);
      // For now - ignoring and not providing feedback on why but its typically formatting of the citation
    }
  },
};
