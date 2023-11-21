import { MigrationInterface, QueryRunner } from 'typeorm';
import { PathUtils } from '@shared/utilities';
import fs from 'fs';

export class SCGMigration1700589730371 implements MigrationInterface {
  name = 'SCGMigration-init-data-seed-1700589730371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(
      PathUtils.resolveToCwd(
        '/libs/database/src/lib/aquinas-bot/summa-contra-gentiles/migrations/sql/scg-seed.sql'
      ),
      {
        encoding: 'utf-8',
      }
    );

    (await Promise.all(sql.split('\n'))).map(async (stmt) => {
      return queryRunner.query(stmt);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // on cascade delete won't be on
    await queryRunner.query(`DELETE FROM paragraph_latin;`);
    await queryRunner.query(`DELETE FROM paragraph;`);
    await queryRunner.query(`DELETE FROM chapter;`);
    await queryRunner.query(`DELETE FROM book;`);
    await queryRunner.query(
      `DELETE FROM sqlite_sequence WHERE name IN ('paragraph', 'chapter', 'paragraph_latin', 'book');`
    );
  }
}
