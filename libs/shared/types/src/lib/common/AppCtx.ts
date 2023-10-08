import { AppName } from './AppDbConfigMap';

export interface AppCtx<DB = unknown> {
  appName: AppName;
  appVersion: string;
  assetsDir: string;
  databases: DB;
}
