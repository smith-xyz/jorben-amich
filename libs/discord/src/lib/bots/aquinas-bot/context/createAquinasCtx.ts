import { AquinasBotAppCtx } from '@shared/types';
import { database } from '@database';
import { PathUtils, TypeUtils } from '@shared/utilities';

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
  };
}
