import { ChatInputCommandInteraction } from 'discord.js';
import { AquinasCommandClient } from '../client';

export async function interactionCreate(
  client: AquinasCommandClient,
  interaction: ChatInputCommandInteraction
) {
  if (!interaction.isChatInputCommand()) return;
  const command = client.getCommandByKey(interaction.commandName);
  if (command) {
    console.log(
      `Action=COMMAND EXEC | TYPE=INTERACTION | NAME=${command.data.name}`
    );
    const { appCtx } = client;
    await command.execute({ isSlashCommand: true, interaction, appCtx });
  }
}
