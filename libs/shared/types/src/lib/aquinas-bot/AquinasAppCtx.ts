import { AppCtx, AppDbConfigMap } from '../common';
import { DataSource, DataSourceOptions, Entity } from 'typeorm';

export type AquinasBotAppName = 'aquinas-bot';

export type AquinasBotDatabaseName = 'summa-theologica';

export type AquinasBotDatabase = Record<AquinasBotDatabaseName, DataSource>;

export type AquinasBotAppCtx = AppCtx<AquinasBotDatabase>;

export type AquinasBotDbConfig = AppDbConfigMap<
  AquinasBotAppName,
  AquinasBotDatabaseName,
  () => DataSourceOptions
>;
