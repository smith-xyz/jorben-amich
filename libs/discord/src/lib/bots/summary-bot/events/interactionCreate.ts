import { ChatInputCommandInteraction } from 'discord.js';
import { DiscordBotClient } from '@shared/clients';
import { SummaryBotAppCtx } from '@shared/types';

export async function interactionCreate(
  client: DiscordBotClient<SummaryBotAppCtx>,
  interaction: ChatInputCommandInteraction
) {
  if (!interaction.isChatInputCommand()) return;
  const command = client.getCommandByKey(interaction.commandName);
  if (command) {
    console.log(
      `Action=COMMAND EXEC | TYPE=INTERACTION | NAME=${command.data.name}`
    );
    try {
      await command.execute({
        isSlashCommand: true,
        interaction,
        client,
      });
    } catch {
      console.error('error executing command');
    }
  }
}
