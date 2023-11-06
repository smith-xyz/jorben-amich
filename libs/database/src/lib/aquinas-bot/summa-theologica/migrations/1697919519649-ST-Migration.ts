import { MigrationInterface, QueryRunner } from 'typeorm';

export class STMigration1697919519649 implements MigrationInterface {
  name = 'STMigration-initial-schema1697919519649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "part_prologue" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "part" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(55) NOT NULL, "value" varchar(5) NOT NULL, "prologueId" integer, CONSTRAINT "REL_1db66bec0cc6afb3d9a496035f" UNIQUE ("prologueId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "question_prologue" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "questionNumber" integer NOT NULL, "title" varchar NOT NULL, "partId" integer, "prologueId" integer, CONSTRAINT "REL_ee0618f74869b98a2f13e13aa9" UNIQUE ("prologueId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "article_content" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "subSection" varchar(5) NOT NULL, "subSectionValue" integer, "content" varchar NOT NULL, "articleId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "articleNumber" integer NOT NULL, "title" varchar NOT NULL, "questionId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_part" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(55) NOT NULL, "value" varchar(5) NOT NULL, "prologueId" integer, CONSTRAINT "REL_1db66bec0cc6afb3d9a496035f" UNIQUE ("prologueId"), CONSTRAINT "FK_1db66bec0cc6afb3d9a496035f1" FOREIGN KEY ("prologueId") REFERENCES "part_prologue" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_part"("id", "name", "value", "prologueId") SELECT "id", "name", "value", "prologueId" FROM "part"`
    );
    await queryRunner.query(`DROP TABLE "part"`);
    await queryRunner.query(`ALTER TABLE "temporary_part" RENAME TO "part"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "questionNumber" integer NOT NULL, "title" varchar NOT NULL, "partId" integer, "prologueId" integer, CONSTRAINT "REL_ee0618f74869b98a2f13e13aa9" UNIQUE ("prologueId"), CONSTRAINT "FK_b82f28b396c018b2d63fe472a3a" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ee0618f74869b98a2f13e13aa9c" FOREIGN KEY ("prologueId") REFERENCES "question_prologue" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_question"("id", "questionNumber", "title", "partId", "prologueId") SELECT "id", "questionNumber", "title", "partId", "prologueId" FROM "question"`
    );
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_question" RENAME TO "question"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_article_content" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "subSection" varchar(5) NOT NULL, "subSectionValue" integer, "content" varchar NOT NULL, "articleId" integer, CONSTRAINT "FK_831c5555fe6588376bb31b08982" FOREIGN KEY ("articleId") REFERENCES "article" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_article_content"("id", "subSection", "subSectionValue", "content", "articleId") SELECT "id", "subSection", "subSectionValue", "content", "articleId" FROM "article_content"`
    );
    await queryRunner.query(`DROP TABLE "article_content"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_article_content" RENAME TO "article_content"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_article" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "articleNumber" integer NOT NULL, "title" varchar NOT NULL, "questionId" integer, CONSTRAINT "FK_931d91feed467835be5f9db400f" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_article"("id", "articleNumber", "title", "questionId") SELECT "id", "articleNumber", "title", "questionId" FROM "article"`
    );
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_article" RENAME TO "article"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" RENAME TO "temporary_article"`
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "articleNumber" integer NOT NULL, "title" varchar NOT NULL, "questionId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "article"("id", "articleNumber", "title", "questionId") SELECT "id", "articleNumber", "title", "questionId" FROM "temporary_article"`
    );
    await queryRunner.query(`DROP TABLE "temporary_article"`);
    await queryRunner.query(
      `ALTER TABLE "article_content" RENAME TO "temporary_article_content"`
    );
    await queryRunner.query(
      `CREATE TABLE "article_content" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "subSection" varchar(5) NOT NULL, "subSectionValue" integer, "content" varchar NOT NULL, "articleId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "article_content"("id", "subSection", "subSectionValue", "content", "articleId") SELECT "id", "subSection", "subSectionValue", "content", "articleId" FROM "temporary_article_content"`
    );
    await queryRunner.query(`DROP TABLE "temporary_article_content"`);
    await queryRunner.query(
      `ALTER TABLE "question" RENAME TO "temporary_question"`
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "questionNumber" integer NOT NULL, "title" varchar NOT NULL, "partId" integer, "prologueId" integer, CONSTRAINT "REL_ee0618f74869b98a2f13e13aa9" UNIQUE ("prologueId"))`
    );
    await queryRunner.query(
      `INSERT INTO "question"("id", "questionNumber", "title", "partId", "prologueId") SELECT "id", "questionNumber", "title", "partId", "prologueId" FROM "temporary_question"`
    );
    await queryRunner.query(`DROP TABLE "temporary_question"`);
    await queryRunner.query(`ALTER TABLE "part" RENAME TO "temporary_part"`);
    await queryRunner.query(
      `CREATE TABLE "part" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(55) NOT NULL, "value" varchar(5) NOT NULL, "prologueId" integer, CONSTRAINT "REL_1db66bec0cc6afb3d9a496035f" UNIQUE ("prologueId"))`
    );
    await queryRunner.query(
      `INSERT INTO "part"("id", "name", "value", "prologueId") SELECT "id", "name", "value", "prologueId" FROM "temporary_part"`
    );
    await queryRunner.query(`DROP TABLE "temporary_part"`);
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "article_content"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "question_prologue"`);
    await queryRunner.query(`DROP TABLE "part"`);
    await queryRunner.query(`DROP TABLE "part_prologue"`);
  }
}
