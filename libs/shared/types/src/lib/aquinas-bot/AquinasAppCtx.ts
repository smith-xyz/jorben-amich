import { AppCtx, AppDbConfigMap } from '../common';
import { DataSource, DataSourceOptions } from 'typeorm';

export type AquinasBotAppName = 'aquinas-bot';

export type AquinasBotDatabaseName =
  | 'summa-theologica'
  | 'summa-contra-gentiles';

export type AquinasBotDatabase = Record<AquinasBotDatabaseName, DataSource>;

export type AquinasBotAppCtx = AppCtx<AquinasBotDatabase>;

export type AquinasBotDbConfig = AppDbConfigMap<
  AquinasBotAppName,
  AquinasBotDatabaseName,
  DataSourceOptions
>;
