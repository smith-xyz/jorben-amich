import { FTS5SearchParams } from '../database';
import { AquinasBotDatabaseName } from './AquinasAppCtx';

export type AquinasBotSearchParams = {
  book: AquinasBotDatabaseName;
} & FTS5SearchParams;
