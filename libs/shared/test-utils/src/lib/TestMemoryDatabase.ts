import { DataSource, DataSourceOptions } from 'typeorm';

export class TestMemoryDatabase {
  public source!: DataSource;

  public constructor(
    opts: Pick<DataSourceOptions, 'name' | 'entities' | 'logging' | 'logger'>
  ) {
    this.source = new DataSource({
      ...opts,
      type: 'better-sqlite3',
      database: ':memory:',
      synchronize: true,
    });
  }

  async setupTestDB() {
    await this.source.initialize();
  }

  async teardownTestDB() {
    await this.source.destroy();
  }
}
