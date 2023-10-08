import { DataSource } from 'typeorm';
import {
  AquinasBotAppCtx,
  AquinasBotDatabase,
  AquinasBotDbConfig,
} from '@shared/types';
import { database } from '@database';
import { PathUtils, FileUtils } from '@shared/utilities';

export async function createAquinasAppCtx(): Promise<AquinasBotAppCtx> {
  console.log('loading app ctx');
  const appVersion = process.env.APP_VERSION;

  const dbConfig = FileUtils.readJSONFile<AquinasBotDbConfig>(
    PathUtils.resolveToCwd(process.env.DB_CONFIG_FILE)
  );

  const assetsDir = PathUtils.resolveToCwd(process.env.ASSETS_DIR);

  console.log('assets directory: ', assetsDir);

  const databases = await createDatabases(dbConfig);

  return {
    appName: 'aquinas-bot',
    appVersion,
    assetsDir,
    databases,
  };
}

export async function createDatabases(
  options: AquinasBotDbConfig
): Promise<AquinasBotDatabase> {
  const stDbConfig = options['aquinas-bot']['summa-theologica'];
  const stDbEntities = database['aquinas-bot']['summa-theologica'];

  const stDb = new DataSource({
    ...stDbConfig,
    ...stDbEntities,
  });

  try {
    await stDb.initialize();
  } catch (err) {
    throw new Error('Error initializing database: ' + err.message);
  }

  return {
    'summa-theologica': stDb,
  };
}
