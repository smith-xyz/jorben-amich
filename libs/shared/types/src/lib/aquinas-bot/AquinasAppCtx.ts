import { AppCtx, AppDbConfigMap } from '../common';
import { DataSource, DataSourceOptions } from 'typeorm';

export type AquinasBotAppName = 'aquinas-bot';

export enum AquinasBotDatabaseName {
  SUMMA_THEOLOGICA = 'summa-theologica',
  SUMMA_CONTRA_GENTILES = 'summa-contra-gentiles',
}

export const aquinasBotDbToTitleMap: Record<AquinasBotDatabaseName, string> = {
  [AquinasBotDatabaseName.SUMMA_THEOLOGICA]: 'Summa Theologiæ',
  [AquinasBotDatabaseName.SUMMA_CONTRA_GENTILES]: 'Summa Contra Gentiles',
} as const;

export type AquinasBotDatabase = Record<AquinasBotDatabaseName, DataSource>;

export type AquinasBotAppCtx = AppCtx<AquinasBotDatabase>;

export type AquinasBotDbConfig = AppDbConfigMap<
  AquinasBotAppName,
  AquinasBotDatabaseName,
  DataSourceOptions
>;
