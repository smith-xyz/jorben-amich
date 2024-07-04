import { SummaryBotAppCtx } from '@shared/types';
import { PathUtils } from '@shared/utilities';
import { MemoryCache } from '@cache';

export async function createSummaryBotCtx(): Promise<SummaryBotAppCtx> {
  console.log('loading app ctx');
  const appVersion = process.env.APP_VERSION;

  const assetsDir = PathUtils.resolveToCwd(process.env.ASSETS_DIR);
  console.log('assets directory: ', assetsDir);

  return {
    appName: 'summary-bot',
    appVersion,
    assetsDir,
    databases: null,
    cache: new MemoryCache(null, {
      ttl: 43200,
      expireCache: 86400,
      maxByteSize: 1000000,
      resizeStrategy: 'LARGEST',
    }),
  };
}
