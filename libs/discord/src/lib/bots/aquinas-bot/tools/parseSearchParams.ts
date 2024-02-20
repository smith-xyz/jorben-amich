import { AquinasBotDatabaseName, AquinasBotSearchParams } from '@shared/types';
import { EnumUtils } from '@shared/utilities';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 *
 * @param interaction
 * @returns
 */
export function parseSearchParams(
  interaction: ChatInputCommandInteraction
): AquinasBotSearchParams {
  try {
    return {
      book: EnumUtils.stringToEnumValue(
        AquinasBotDatabaseName,
        interaction.options.getString('book')
      ),
      searchText: interaction.options.getString('text'),
      useNear: interaction.options.getBoolean('narrow'),
    };
  } catch (err) {
    console.error(`SLASH COMMAND PARSE ERROR=${err.message}`);
    return null;
  }
}
