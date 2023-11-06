import { PathUtils, FileUtils } from '@shared/utilities';
import { DataSourceOptions } from 'typeorm';
import * as migrations from '../migrations';

import { config } from 'dotenv';
import { getSummaTheologicaEntities } from '@models';

config({ path: PathUtils.resolveToCwd('./apps/aquinas-bot/.env') });

export function getSummaTheologicaDataSourceOptions(): DataSourceOptions {
  const dbConfig = FileUtils.readJSONFile(
    PathUtils.resolveToCwd(process.env.DB_CONFIG_FILE)
  );

  const stDbConfig = dbConfig['aquinas-bot']['summa-theologica'];

  return {
    ...stDbConfig,
    entities: getSummaTheologicaEntities(),
    migrations: Object.values(migrations),
  };
}
