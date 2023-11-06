import { database } from '@database';
import { FileUtils, PathUtils } from '@shared/utilities';
import { AppDbConfigMap } from '@shared/types';
import { apps } from './data-loaders';

const dbConfig = FileUtils.readJSONFile<AppDbConfigMap>(
  PathUtils.resolveToCwd(process.env.DB_CONFIG_FILE)
);

async function configIterator<T = void>(
  dbConfig: AppDbConfigMap,
  exec: (app: string, dbConfig: string) => Promise<T>
): Promise<T> {
  const appKeys = Object.keys(dbConfig);

  for (const app of appKeys) {
    const appConfig = Object.keys(dbConfig[app]);
    for (const db of appConfig) {
      return exec(app, db);
    }
  }
}

async function loadDbData(appName: string, dbName: string) {
  const db = database[appName][dbName];
  await db.initialize();
  const loader = apps[appName][dbName];
  loader && (await loader(appName, dbName, db));
}

// load data
(async () => {
  try {
    await configIterator(dbConfig, loadDbData);
  } catch (err) {
    console.error(err.message);
  }
})();
