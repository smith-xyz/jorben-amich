import { AppName } from './AppDbConfigMap';

export interface AppCtx<DB = unknown, Cache = unknown> {
  appName: AppName;
  appVersion: string;
  assetsDir: string;
  databases: DB;
  cache?: Cache;
}
