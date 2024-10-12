import { SummaContraGentilesService, SummaTheologicaService } from '@service';
import {
  AquinasBotDatabaseName,
  Command,
  aquinasBotDbToTitleMap,
  InteractionContext,
  AquinasBotClient,
} from '@shared/types';
import { parseSearchParams } from '../tools';
import { searchSlashCommand } from '../slash-command-config';
import { ComponentType } from 'discord.js';
import { SearchViewManager, createBaseInteractionReply } from '../views';
import { CacheUtils } from '@shared/utilities';

export const searchCommand: Command = {
  data: searchSlashCommand,
  execute: async (ctx: InteractionContext<AquinasBotClient>) => {
    const { interaction, client } = ctx;
    const appCtx = client.context;

    const parameters = parseSearchParams(interaction);

    if (!parameters) {
      // For now - ignoring and not providing feedback on why
      console.debug('SEARCH EVENT ERROR: parameters missing');
      return;
    }

    const replyOptions = createBaseInteractionReply({
      ctx,
      title: `Search Results in *${aquinasBotDbToTitleMap[parameters.book]}*`,
      description: 'Hmm...having trouble returning results right now.',
    });

    let searchResults: string[] = [];

    try {
      // duplicate code, clean up
      switch (parameters.book) {
        case AquinasBotDatabaseName.SUMMA_THEOLOGICA: {
          const stService = new SummaTheologicaService(appCtx);
          const results = await CacheUtils.memoizeClassFunction(
            stService,
            stService.search,
            appCtx.cache
          )(parameters);
          searchResults = results.map(
            SummaTheologicaService.buildCitationWithHyperlink
          );
          break;
        }
        case AquinasBotDatabaseName.SUMMA_CONTRA_GENTILES: {
          const scgService = new SummaContraGentilesService(appCtx);
          const results = await CacheUtils.memoizeClassFunction(
            scgService,
            scgService.search,
            appCtx.cache
          )(parameters);
          searchResults = results.map(
            SummaContraGentilesService.buildCitationWithHyperlink
          );
          break;
        }
      }
    } catch (err) {
      console.error('SERVICE ERROR: ', err.message);
      await interaction.reply(replyOptions);
      return;
    }

    if (searchResults.length === 0) {
      replyOptions.embeds[0].setDescription(
        `There are 0 results for '${parameters.searchText}'.`
      );
      await interaction.reply(replyOptions);
      return;
    }

    if (searchResults.length > 1000) {
      replyOptions.embeds[0].setDescription(
        'Your search is too broad, consider narrowing the search. If necessary set "narrow" = true when using this command.'
      );
      await interaction.reply(replyOptions);
      return;
    }

    const searchViewManager = new SearchViewManager(replyOptions, {
      searchResults,
      searchText: parameters.searchText,
      resultsPerPage: 10,
    });

    const response = await interaction.reply(replyOptions);

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120_000,
    });

    collector.on('collect', async (interaction) => {
      await interaction.update({
        ...searchViewManager.setPagination(interaction.customId),
      });
    });

    // close out on end of timer
    collector.on('end', async (collection) => {
      if (collection.last()) {
        collection.last().editReply({
          ...replyOptions,
          components: [],
        });
        return;
      }
      response.edit({
        ...replyOptions,
        components: [],
      });
    });
  },
};
