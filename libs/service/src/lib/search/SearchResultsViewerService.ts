export interface SearchResultsPaginationServiceOptions<T> {
  searchResults: Array<T>;
  resultsPerPage: number;
  searchText: string;
  currentIndex?: number;
}

export class SearchResultsPaginationService<T> {
  private readonly rawResults: Array<T>;
  public paginatedResults: Array<T>;
  protected readonly resultsPerPage: number;
  protected readonly searchText: string;
  protected currentIndex: number;

  constructor({
    resultsPerPage,
    searchResults,
    currentIndex = 0,
    searchText,
  }: SearchResultsPaginationServiceOptions<T>) {
    this.rawResults = searchResults;
    this.paginatedResults = searchResults.slice(
      0,
      currentIndex + resultsPerPage
    );
    this.searchText = searchText;
    this.resultsPerPage = resultsPerPage;
    this.currentIndex = currentIndex;
  }

  public get totalResults() {
    return this.rawResults.length;
  }

  public setNextPage() {
    const { currentIndex, resultsPerPage } = this;
    if (currentIndex + resultsPerPage > this.rawResults.length) return this;
    this.currentIndex += resultsPerPage;
    this.paginatedResults = this.rawResults.slice(
      this.currentIndex,
      this.currentIndex + resultsPerPage
    );
    return this;
  }

  public setPreviousPage() {
    const { currentIndex, resultsPerPage } = this;
    if (currentIndex === 0) return this;
    this.currentIndex -= resultsPerPage;
    this.paginatedResults = this.rawResults.slice(
      this.currentIndex,
      this.currentIndex + resultsPerPage
    );
    return this;
  }
}
