import { Message } from 'discord.js';
import { AquinasCommandClient } from '../client';

export async function messageCreate(
  client: AquinasCommandClient,
  interaction: Message
) {
  if (interaction.author.bot) return;
  const command = client.getCommandByMessageTrigger(interaction.content);
  if (command) {
    console.log(
      `Action=COMMAND EXEC | TYPE=MESSAGE | NAME=${command.data.name}`
    );
    const { appCtx } = client;
    await command.execute({ isSlashCommand: false, interaction, appCtx });
  }
}
