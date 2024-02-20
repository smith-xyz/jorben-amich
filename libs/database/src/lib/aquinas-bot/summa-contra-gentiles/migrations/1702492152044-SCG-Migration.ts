import { PathUtils } from '@shared/utilities';
import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';

export class SCGMigration1702492152044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(
      PathUtils.resolveToCwd(
        '/libs/database/src/lib/aquinas-bot/summa-contra-gentiles/migrations/sql/search-fts5.sql'
      ),
      {
        encoding: 'utf-8',
      }
    );

    for (const sqlStmt of sql.split('\n')) {
      await queryRunner.query(sqlStmt);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE paragraph_fts`);
  }
}
