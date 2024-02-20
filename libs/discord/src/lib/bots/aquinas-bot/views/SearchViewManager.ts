import {
  SearchResultsPaginationService,
  SearchResultsPaginationServiceOptions,
} from '@service';
import { BackButton, NextButton } from './Buttons';
import { ActionRowBuilder } from 'discord.js';
import { BaseReply } from './createBaseInteractionReply';

export class SearchViewManager<T> extends SearchResultsPaginationService<T> {
  private actionRow = new ActionRowBuilder().addComponents(NextButton);

  // always manipulate the same reply
  private reply: BaseReply;

  constructor(
    reply: BaseReply,
    options: SearchResultsPaginationServiceOptions<T>
  ) {
    super(options);

    // set initial
    if (options.searchResults.length > options.resultsPerPage) {
      reply.components.push(this.actionRow);
    }

    reply.embeds[0].setDescription(this.paginationDescription);

    this.reply = reply;
  }

  public setPagination(customId: string) {
    return customId === 'next-button' ? this.nextPage() : this.previousPage();
  }

  public nextPage() {
    const { currentIndex, totalResults, resultsPerPage } = this;
    if (currentIndex < totalResults) {
      this.setNextPage();
      const newCurrentIndex = this.currentIndex;
      if (newCurrentIndex >= resultsPerPage)
        this.actionRow.setComponents([BackButton, NextButton]);
      if (newCurrentIndex + resultsPerPage > totalResults) {
        this.actionRow.setComponents([BackButton]);
      }
      this.reply.embeds[0].setDescription(this.paginationDescription);
    }
    return this.reply;
  }

  public previousPage() {
    const { currentIndex, resultsPerPage } = this;
    if (currentIndex !== 0) {
      this.setPreviousPage();
      const newCurrentIndex = this.currentIndex;
      if (newCurrentIndex < resultsPerPage)
        this.actionRow.setComponents([NextButton]);
      if (newCurrentIndex + resultsPerPage > resultsPerPage)
        this.actionRow.setComponents([BackButton, NextButton]);

      this.reply.embeds[0].setDescription(this.paginationDescription);
    }

    return this.reply;
  }

  private get paginationDescription() {
    const {
      paginatedResults,
      currentIndex,
      searchText,
      totalResults,
      resultsPerPage,
    } = this;

    const resultText = totalResults > 1 ? 'results' : 'result';
    const maxResultsOnPage =
      currentIndex + resultsPerPage > totalResults
        ? totalResults
        : currentIndex + resultsPerPage;
    const showingText =
      totalResults > resultsPerPage
        ? `${currentIndex + 1}-${maxResultsOnPage}`
        : ``;

    return `Showing ${showingText} ${resultText} for '${searchText}:'\n
        ${paginatedResults
          .map((str, i) => `${i + currentIndex + 1}: ${str}`)
          .join('\n\n')}\n\n
          Total Results: ${totalResults}`;
  }
}
