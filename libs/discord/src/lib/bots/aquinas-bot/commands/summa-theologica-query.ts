import { SummaTheologicaService } from '@service';
import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import { createStandardReply, parseSummaTheologicaParams } from '../tools';
import { summaTheologicaQuerySlashCommand } from '../slash-command-config';

export const queryStCommand: Command = {
  data: summaTheologicaQuerySlashCommand,
  messageTrigger: (message: string) =>
    message.toLowerCase().startsWith('summa theologica'),
  async execute(ctx: AquinasInteractionContext) {
    const { isSlashCommand, interaction } = ctx;

    const parameters = parseSummaTheologicaParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.debug('ST EVENT ERROR: parameters missing');
      return;
    }

    try {
      const citation = SummaTheologicaService.buildStCitation(parameters);

      const replyOptions = createStandardReply({
        ctx,
        title: citation,
        description: 'Hmm...do not remember writing that one.',
      });

      const stService = new SummaTheologicaService(ctx.appCtx);
      const stEntry = await stService.getSummaTheologicaEntry(parameters);

      if (!stEntry || !stEntry.content) {
        // on slash commands we can let the user know it wasn't found
        // need to fix how we're trying to do everything under one command
        if (isSlashCommand) await interaction.reply(replyOptions);
        return;
      }

      replyOptions.embeds[0].description = stEntry.content;

      await interaction.reply(replyOptions);
    } catch (err) {
      console.error('SERVICE ERROR: ', err.message);
      // For now - ignoring and not providing feedback on why but its typically formatting of the citation
    }
  },
};
