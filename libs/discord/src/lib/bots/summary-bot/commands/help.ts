import { Command, InteractionContext, SummaryBotAppCtx } from '@shared/types';
import { helpSlashCommand } from '../slash-command-config';

export const helpCommand: Command = {
  data: helpSlashCommand,
  async execute(ctx: InteractionContext<SummaryBotAppCtx>) {
    const { interaction } = ctx;

    await interaction.reply('Coming soon!');
  },
};
