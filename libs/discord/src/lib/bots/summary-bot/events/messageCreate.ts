import { DiscordBotClient, SummaryBotAppCtx } from '@shared/types';
import { Message } from 'discord.js';

export async function messageCreate(
  client: DiscordBotClient<SummaryBotAppCtx>,
  interaction: Message
) {
  if (interaction.author.bot) return;
  const command = client.getCommandByMessageTrigger(interaction.content);
  if (command) {
    console.log(
      `Action=COMMAND EXEC | TYPE=MESSAGE | NAME=${command.data.name}`
    );
    await command.execute({ isSlashCommand: false, interaction, client });
  }
}
