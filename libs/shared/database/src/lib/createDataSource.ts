import { DataSource, DataSourceOptions } from 'typeorm';

export type GetDatasourceConfig = () => DataSourceOptions;

export function createDataSource(
  config: DataSourceOptions | GetDatasourceConfig
) {
  const generatedConfig = typeof config === 'function' ? config() : config;
  return new DataSource(generatedConfig);
}
