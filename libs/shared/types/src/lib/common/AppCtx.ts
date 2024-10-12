import { AppName } from './AppDbConfigMap';

type DbBase = {
  initialize: () => void;
};

export interface AppCtx<DB = Record<string, DbBase>, Cache = unknown> {
  appName: AppName;
  appVersion: string;
  assetsDir: string;
  databases?: DB;
  cache?: Cache;
}
