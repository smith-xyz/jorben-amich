import { Command, InteractionContext, SummaryBotAppCtx } from '@shared/types';
import { summarizeSlashCommand } from '../slash-command-config';
import { GoogleGenAI } from '@shared/clients';

const messagesToken = '@@MESSAGES@@';
const summaryPrompt = `
  Given this list of messages, provide a summary of all of the user's messages in the following format:
  
  **<Username here>**: <Summary Here>
  <line break here>

  Here are the messages: 
  ${messagesToken}
`;

export const summarizeCommand: Command = {
  data: summarizeSlashCommand,
  async execute(ctx: InteractionContext<SummaryBotAppCtx>) {
    const { interaction } = ctx;

    try {
      const limit = interaction.options.getNumber('limit');

      const messages = (
        await interaction.channel.messages.fetch({ limit })
      ).reverse();

      const formattedMessages = messages
        .map((msg) => {
          return `${msg.author.username}: ${msg.content}`;
        })
        .join('\n');

      const googleAi = new GoogleGenAI({
        apiKey: process.env.GOOGLE_AI_API_KEY,
        model: 'gemini-1.5-flash',
      });

      const summary = await googleAi.generateContent(
        summaryPrompt.replace(messagesToken, formattedMessages)
      );

      await interaction.reply(`
        Message summary in ${interaction.channel.name} - ${messages.size} messages summarized:\n\n${summary}
      `);
    } catch (err) {
      console.error('unable to send summary, Message=' + err.message);
      await interaction.reply(
        'Unable to summarize right now, check with administrator'
      );
    }
  },
};
