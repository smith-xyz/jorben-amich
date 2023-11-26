import { ChatInteraction, RomanNumeral } from '@shared/utilities';
import { SummaContraGentilesQuery } from '@shared/types';
import { ChatInputCommandInteraction, Message } from 'discord.js';

/**
 *
 * @param interaction
 * @returns
 * @todo need to handle this differently
 */
export function parseSummaContraGentilesParams(interaction: ChatInteraction) {
  return interaction instanceof ChatInputCommandInteraction
    ? parseParamsFromInteraction(interaction)
    : parseParamsFromMessage(interaction);
}

function parseParamsFromInteraction(
  interaction: ChatInputCommandInteraction
): SummaContraGentilesQuery {
  try {
    return {
      book: interaction.options.getNumber('book'),
      chapter: interaction.options.getNumber('chapter'),
      paragraph: interaction.options.getNumber('paragraph'),
      latin: interaction.options.getBoolean('latin'),
    };
  } catch (err) {
    console.error(`SLASH COMMAND PARSE ERROR=${err.message}`);
    return null;
  }
}

// example: summa contra gentiles III.23.1
// for latin: summa contra gentiles III.23.1 latin
function parseParamsFromMessage(
  interaction: Message
): SummaContraGentilesQuery {
  const { content } = interaction;
  const args = content.split('.').map((val) => val.trim().toLowerCase());
  // if the base three params aren't there, not doing anything
  if (args.length < 3) return null;
  const [book, chapter, paragraph] = args;

  const parsedBookValue = RomanNumeral.romanNumeralToNumber(
    book.replace('summa contra gentiles ', '').toUpperCase()
  );
  const parsedChapterValue = parseInt(chapter) || null;
  const [paragarphValue, latin] = paragraph.split(' ');
  const parsedParagraphValue = parseInt(paragarphValue) || null;
  const parsedLatinValue = !!latin;

  const result = {
    book: parsedBookValue,
    chapter: parsedChapterValue,
    paragraph: parsedParagraphValue,
    latin: parsedLatinValue,
  };

  // validate to see
  if (Object.keys(result).some((key) => key !== 'latin' && !result[key]))
    return null;

  return result;
}
