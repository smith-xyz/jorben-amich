import { ChatInputCommandInteraction } from 'discord.js';
import { AquinasCommandClient } from '../client';
import { AquinasInteractionContext } from '../interfaces';

export async function interactionCreate(
  client: AquinasCommandClient,
  interaction: ChatInputCommandInteraction
) {
  if (!interaction.isChatInputCommand()) return;
  const command = client.getCommandByKey(interaction.commandName);
  if (command) {
    console.log(interaction.commandName, 'EXECUTING');
    const { appCtx } = client;
    await command.execute({ interaction, appCtx });
  }
}
