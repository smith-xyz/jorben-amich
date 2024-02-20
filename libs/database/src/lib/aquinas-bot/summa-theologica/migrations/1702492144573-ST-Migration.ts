import { PathUtils } from '@shared/utilities';
import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';

export class STMigration1702492144573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(
      PathUtils.resolveToCwd(
        '/libs/database/src/lib/aquinas-bot/summa-theologica/migrations/sql/search-fts5.sql'
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
    await queryRunner.query(`DROP TABLE article_fts`);
  }
}
