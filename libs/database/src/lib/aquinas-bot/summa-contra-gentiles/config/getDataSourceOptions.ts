import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { PathUtils, FileUtils } from '@shared/utilities';
import { getSummaContraGentilesEntites } from '@models';
import { AquinasBotDbConfig } from '@shared/types';
import * as migrations from '../migrations';

config({ path: PathUtils.resolveToCwd('./apps/aquinas-bot/.env') });

export function getDataSourceOptions(): DataSourceOptions {
  const dbConfig = FileUtils.readJSONFile<AquinasBotDbConfig>(
    PathUtils.resolveToCwd(process.env.DB_CONFIG_FILE)
  );

  const scgDbConfig = dbConfig['aquinas-bot']['summa-contra-gentiles'];

  return {
    ...scgDbConfig,
    entities: getSummaContraGentilesEntites(),
    migrations: Object.values(migrations),
  };
}
