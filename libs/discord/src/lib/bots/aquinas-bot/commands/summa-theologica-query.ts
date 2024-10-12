import { SummaTheologicaService } from '@service';
import { AquinasBotClient, Command, InteractionContext } from '@shared/types';
import { parseSummaTheologicaParams } from '../tools';
import { summaTheologicaQuerySlashCommand } from '../slash-command-config';
import { createBaseInteractionReply } from '../views';

export const queryStCommand: Command = {
  data: summaTheologicaQuerySlashCommand,
  async execute(ctx: InteractionContext<AquinasBotClient>) {
    const { isSlashCommand, interaction, client } = ctx;

    const parameters = parseSummaTheologicaParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.debug('ST EVENT ERROR: parameters missing');
      return;
    }

    try {
      const citation = SummaTheologicaService.buildCitation(parameters);

      const replyOptions = createBaseInteractionReply({
        ctx,
        title: citation,
        description: 'Hmm...do not remember writing that one.',
      });

      const stService = new SummaTheologicaService(client.context);
      const stEntry = await stService.getSummaTheologicaEntry(parameters);

      if (!stEntry || !stEntry.content) {
        // on slash commands we can let the user know it wasn't found
        // need to fix how we're trying to do everything under one command
        if (isSlashCommand) await interaction.reply(replyOptions);
        return;
      }

      replyOptions.embeds[0].setDescription(stEntry.content);

      await interaction.reply(replyOptions);
    } catch (err) {
      console.error('SERVICE ERROR: ', err.message);
      // For now - ignoring and not providing feedback on why but its typically formatting of the citation
    }
  },
};
