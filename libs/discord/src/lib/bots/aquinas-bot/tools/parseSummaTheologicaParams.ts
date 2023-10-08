import { ChatInteraction } from '@shared/utilities';
import { SummaTheologicaQuery } from '@shared/types';
import { ChatInputCommandInteraction, Message } from 'discord.js';
import { PartValue, SubSection } from '@database';

/**
 *
 * @param interaction
 * @returns
 * @todo need to handle this differently
 */
export function parseSummaTheologicaParams(interaction: ChatInteraction) {
  return interaction instanceof ChatInputCommandInteraction
    ? parseParamsFromInteraction(interaction)
    : parseParamsFromMessage(interaction);
}

function parseParamsFromInteraction(
  interaction: ChatInputCommandInteraction
): SummaTheologicaQuery {
  try {
    return {
      part: interaction.options.getString('part') as PartValue, // these are controlled options
      questionNumber: interaction.options.getNumber('question'),
      articleNumber: interaction.options.getNumber('article'),
      subSection: getSubsection(interaction.options.getString('subsection')),
      subSectionValue: interaction.options.getNumber('subsection-number'),
    };
  } catch (err) {
    console.error(`SLASH COMMAND PARSE ERROR=${err.message}`);
    return null;
  }
}

// example: summa theologica I-II, Q. 1, Art. 1, arg. 1
function parseParamsFromMessage(interaction: Message): SummaTheologicaQuery {
  const { content } = interaction;
  const args = content.split(',').map((val) => val.trim().toLowerCase());
  // if the base three params aren't there, not doing anything
  if (args.length < 3) return null;
  const [part, question, article, subSection] = args;

  const parsedPartValue = part
    .replace('summa theologica ', '')
    .toUpperCase() as PartValue;
  const parsedQuestionNumber = Number(question.replace('q. ', '')) || null;
  const parsedArticleNumber = Number(article.replace('art. ', '')) || null;
  const parsedSubSection = getSubsection(subSection);

  let parsedSubSectionValue = null;
  if (
    (subSection && parsedSubSection === 'ad.') ||
    parsedSubSection === 'arg.'
  ) {
    parsedSubSectionValue = Number(subSection.match(/[\d]+/)[0]) || null;
  }

  const result = {
    part: parsedPartValue as PartValue,
    questionNumber: parsedQuestionNumber,
    articleNumber: parsedArticleNumber,
    subSection: parsedSubSection,
    subSectionValue: parsedSubSectionValue,
  };

  // validate to see
  if (
    Object.keys(result).some((key) => key !== 'subSectionValue' && !result[key])
  )
    return null;

  return result;
}

/**
 * pr. — prologue to a question
 * arg. — objections
 * s. c. — “On the contrary”
 * co. — “I respond that”
 * ad. — replies to objections
 * if none provided, default is _I answer that or "co"
 */
function getSubsection(userInput?: string): SubSection {
  if (!userInput) return 'co.';
  if (userInput.startsWith('arg.')) {
    return 'arg.';
  }
  if (userInput.startsWith('s. c.') || userInput.startsWith('s.c.')) {
    return 's. c.';
  }
  if (userInput.startsWith('ad.')) {
    return 'ad.';
  }
  return 'co.';
}
