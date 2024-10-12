import { AquinasBotClient } from '@shared/types';
import { ChatInputCommandInteraction } from 'discord.js';

export async function interactionCreate(
  client: AquinasBotClient,
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
    } catch (err) {
      console.error(`error executing command MSG=${err.message}`);
    }
  }
}
