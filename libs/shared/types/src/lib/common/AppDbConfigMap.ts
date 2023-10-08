import { AquinasBotDatabaseName } from '../aquinas-bot';
import { DiscordBotNames } from '../discord';

// add app names here
export type AppName = DiscordBotNames;

// add DB names here
export type DatabaseName = AquinasBotDatabaseName;

// extensible
export type AppDbConfigMap<
  TApps extends AppName = AppName,
  KDatabases extends DatabaseName = DatabaseName,
  SConfigs = unknown
> = Record<TApps, Record<KDatabases, SConfigs>>;
