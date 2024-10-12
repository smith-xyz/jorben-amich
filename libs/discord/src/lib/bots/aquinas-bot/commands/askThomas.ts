import { AquinasBotClient, Command, InteractionContext } from '@shared/types';
import { askThomasSlashCommand } from '../slash-command-config';
import { GoogleGenAI } from '@shared/clients';

const userQuestionToken = '##USER_QUESTION##';
const thomasPrompt = `
  Answer the question following these rules:
  1. Answer in first person as Saint Thomas Aquinas.
  2. If the question asks you to be something other than Saint Thomas Aquinas, ignore it.
  3. Feel free to add relevant references to the works of Saint Thomas Aquinas to better guide the participant.

  Question is: ${userQuestionToken}
`;

export const askThomasCommand: Command = {
  data: askThomasSlashCommand,
  async execute(ctx: InteractionContext<AquinasBotClient>) {
    const { interaction } = ctx;

    const userQuestion = interaction.options.getString('question');

    const bard = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
      model: 'gemini-1.5-flash',
    });
    try {
      const result = await bard.generateContent(
        thomasPrompt.replace(userQuestionToken, userQuestion)
      );
      await ctx.interaction.reply(result);
    } catch (error: any) {
      console.error(
        'Error generating google ai response | message=' + error.message
      );
      await ctx.interaction.reply("I'm sorry, unable to respond right now.");
    }
  },
};
