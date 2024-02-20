import { AquinasBotDatabaseName, aquinasBotDbToTitleMap } from '@shared/types';
import { SlashCommandBuilder } from 'discord.js';

export const searchSlashCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search through the available works of Thomas Aquinas')
  .addStringOption((option) =>
    option
      .setName('book')
      .setDescription('select from the available works')
      .setRequired(true)
      .setChoices(
        {
          name: aquinasBotDbToTitleMap[AquinasBotDatabaseName.SUMMA_THEOLOGICA],
          value: AquinasBotDatabaseName.SUMMA_THEOLOGICA,
        },
        {
          name: aquinasBotDbToTitleMap[
            AquinasBotDatabaseName.SUMMA_CONTRA_GENTILES
          ],
          value: AquinasBotDatabaseName.SUMMA_CONTRA_GENTILES,
        }
      )
  )
  .addStringOption((option) =>
    option
      .setName('text')
      .setDescription('Provide text to search')
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName('narrow')
      .setDescription(
        'Search by sets of terms, prefix terms or phrases in specified proximity'
      )
  )
  .toJSON();
