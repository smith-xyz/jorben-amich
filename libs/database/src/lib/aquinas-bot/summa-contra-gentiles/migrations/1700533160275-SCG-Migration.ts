import { MigrationInterface, QueryRunner } from 'typeorm';

export class SCGMigration1700533160275 implements MigrationInterface {
  name = 'SCGMigration1700533160275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "paragraph_latin" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "paragraph" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "paragraphNumber" integer NOT NULL, "content" varchar NOT NULL, "chapterId" integer, "latinParagraphId" integer, CONSTRAINT "REL_549712a0ac05c99ce2014f0d1c" UNIQUE ("latinParagraphId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "chapter" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "chapterNumber" integer NOT NULL, "title" varchar NOT NULL, "latinTitle" varchar NOT NULL, "openingVerse" varchar, "latinOpeningVerse" varchar, "bookId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(55) NOT NULL, "bookNumber" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_paragraph" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "paragraphNumber" integer NOT NULL, "content" varchar NOT NULL, "chapterId" integer, "latinParagraphId" integer, CONSTRAINT "REL_549712a0ac05c99ce2014f0d1c" UNIQUE ("latinParagraphId"), CONSTRAINT "FK_a14605b236f8032016664cbae2b" FOREIGN KEY ("chapterId") REFERENCES "chapter" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_549712a0ac05c99ce2014f0d1c9" FOREIGN KEY ("latinParagraphId") REFERENCES "paragraph_latin" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_paragraph"("id", "paragraphNumber", "content", "chapterId", "latinParagraphId") SELECT "id", "paragraphNumber", "content", "chapterId", "latinParagraphId" FROM "paragraph"`
    );
    await queryRunner.query(`DROP TABLE "paragraph"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_paragraph" RENAME TO "paragraph"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_chapter" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "chapterNumber" integer NOT NULL, "title" varchar NOT NULL, "latinTitle" varchar NOT NULL, "openingVerse" varchar, "latinOpeningVerse" varchar, "bookId" integer, CONSTRAINT "FK_ec31fc72d948403c35b8cf289f0" FOREIGN KEY ("bookId") REFERENCES "book" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_chapter"("id", "chapterNumber", "title", "latinTitle", "openingVerse", "latinOpeningVerse", "bookId") SELECT "id", "chapterNumber", "title", "latinTitle", "openingVerse", "latinOpeningVerse", "bookId" FROM "chapter"`
    );
    await queryRunner.query(`DROP TABLE "chapter"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_chapter" RENAME TO "chapter"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chapter" RENAME TO "temporary_chapter"`
    );
    await queryRunner.query(
      `CREATE TABLE "chapter" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "chapterNumber" integer NOT NULL, "title" varchar NOT NULL, "latinTitle" varchar NOT NULL, "openingVerse" varchar, "latinOpeningVerse" varchar, "bookId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "chapter"("id", "chapterNumber", "title", "latinTitle", "openingVerse", "latinOpeningVerse", "bookId") SELECT "id", "chapterNumber", "title", "latinTitle", "openingVerse", "latinOpeningVerse", "bookId" FROM "temporary_chapter"`
    );
    await queryRunner.query(`DROP TABLE "temporary_chapter"`);
    await queryRunner.query(
      `ALTER TABLE "paragraph" RENAME TO "temporary_paragraph"`
    );
    await queryRunner.query(
      `CREATE TABLE "paragraph" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "paragraphNumber" integer NOT NULL, "content" varchar NOT NULL, "chapterId" integer, "latinParagraphId" integer, CONSTRAINT "REL_549712a0ac05c99ce2014f0d1c" UNIQUE ("latinParagraphId"))`
    );
    await queryRunner.query(
      `INSERT INTO "paragraph"("id", "paragraphNumber", "content", "chapterId", "latinParagraphId") SELECT "id", "paragraphNumber", "content", "chapterId", "latinParagraphId" FROM "temporary_paragraph"`
    );
    await queryRunner.query(`DROP TABLE "temporary_paragraph"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "chapter"`);
    await queryRunner.query(`DROP TABLE "paragraph"`);
    await queryRunner.query(`DROP TABLE "paragraph_latin"`);
  }
}
