interface FTS5SearchResultBase {
  rank: string;
  content: string;
}

export interface FTS5SearchParams {
  searchText: string;
  useNear: boolean;
}
/**
 * @template T any appending entities or objects relating to entities when using FTS5 search in sqlite
 */
export type FTS5SearchResult<T = unknown> = FTS5SearchResultBase & T;
