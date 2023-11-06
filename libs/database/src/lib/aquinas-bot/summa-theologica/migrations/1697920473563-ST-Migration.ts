import { PathUtils } from '@shared/utilities';
import fs from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class STMigration1697920473563 implements MigrationInterface {
  name = 'STMigration-init-data-seed-1697919519649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(
      PathUtils.resolveToCwd(
        '/libs/database/src/lib/aquinas-bot/summa-theologica/migrations/sql/st-seed.sql'
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
    // on cascade delete should take care of the rest
    await queryRunner.query(`DELETE FROM part_prologue;`);
    await queryRunner.query(`DELETE FROM question_prologue;`);
    await queryRunner.query(`DELETE FROM part;`);
    await queryRunner.query(`DELETE FROM article_content;`);
    await queryRunner.query(`DELETE FROM article;`);
    await queryRunner.query(`DELETE FROM question;`);
  }
}
