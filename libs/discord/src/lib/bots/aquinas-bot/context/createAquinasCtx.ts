import { AquinasBotAppCtx } from '@shared/types';
import { database } from '@database';
import { PathUtils, TypeUtils } from '@shared/utilities';
import { MemoryCache } from '@cache';

export async function createAquinasAppCtx(): Promise<AquinasBotAppCtx> {
  console.log('loading app ctx');
  const appVersion = process.env.APP_VERSION;

  const assetsDir = PathUtils.resolveToCwd(process.env.ASSETS_DIR);
  console.log('assets directory: ', assetsDir);

  console.log('initializing databases');
  const dbKeys = TypeUtils.getTypedKeys(database['aquinas-bot']);
  await Promise.all(
    dbKeys.map((dbKey) => database['aquinas-bot'][dbKey].initialize())
  );

  return {
    appName: 'aquinas-bot',
    appVersion,
    assetsDir,
    databases: {
      ...database['aquinas-bot'],
    },
    cache: new MemoryCache(null, {
      ttl: 43200,
      expireCache: 86400,
      maxByteSize: 1000000,
      resizeStrategy: 'LARGEST',
    }),
  };
}
