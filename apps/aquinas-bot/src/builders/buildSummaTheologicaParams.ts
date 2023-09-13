import { ChatInteraction } from '@shared/utilities';
import { SummaTheologicaQuery } from '../interfaces';
import { ChatInputCommandInteraction, Message } from 'discord.js';

export function buildSummaTheologicaParams(interaction: ChatInteraction) {
  return interaction instanceof ChatInputCommandInteraction
    ? buildParamsFromInteraction(interaction)
    : buildParamsFromMessage(interaction);
}

function buildParamsFromInteraction(
  interaction: ChatInputCommandInteraction
): SummaTheologicaQuery {
  return {
    part: interaction.options.getString('part'), // these are controlled options
    question: interaction.options.getString('question'),
    article: interaction.options.getString('article'),
    subsection: getSubsection(interaction.options.getString('subsection')),
  };
}

function buildParamsFromMessage(interaction: Message): SummaTheologicaQuery {
  const { content } = interaction;
  const args = content.split(',').map((val) => val.trim().toLowerCase());
  // if the base three params aren't there, not doing anything
  if (args.length < 3) return null;
  let [part, question, article] = args;
  part = part.replace('summa theologica ', '').toUpperCase();
  question = question.replace('q. ', '');
  article = article.replace('art. ', '');
  const subsection = getSubsection(args[3]);
  return {
    part,
    question,
    article,
    subsection,
  };
}

/**
 * pr. — prologue to a question
 * arg. — objections
 * s. c. — “On the contrary”
 * co. — “I respond that”
 * ad. — replies to objections
 * if none provided, default is _I answer that or "co"
 */
function getSubsection(value?: string): string {
  if (!value) return 'co.';
  const allowed = ['pr.', 'arg.', 's.c.', 's. c.', 'co.', 'ad.'].some((val) =>
    value.startsWith(val)
  );
  // if we fail we default and reset it to co.
  if (allowed) return value;
  return 'co.';
}
