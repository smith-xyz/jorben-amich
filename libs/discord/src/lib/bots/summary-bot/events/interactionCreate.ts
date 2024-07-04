import { ChatInputCommandInteraction } from 'discord.js';
import { SummaryBotClient } from '../client';

export async function interactionCreate(
  client: SummaryBotClient,
  interaction: ChatInputCommandInteraction
) {
  if (!interaction.isChatInputCommand()) return;
  const command = client.getCommandByKey(interaction.commandName);
  if (command) {
    console.log(
      `Action=COMMAND EXEC | TYPE=INTERACTION | NAME=${command.data.name}`
    );
    const { appCtx } = client;
    try {
      await command.execute({
        isSlashCommand: true,
        interaction,
        appCtx,
        client,
      });
    } catch {
      console.error('error executing command');
    }
  }
}
