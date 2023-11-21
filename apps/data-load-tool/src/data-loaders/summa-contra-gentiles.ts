import { SummaContraGentilesBookBuilder } from '@service';
import { PathUtils } from '@shared/utilities';
import { DataSource } from 'typeorm';
import fs from 'fs';

export async function loadSummaContraGentilesData(
  appName: string,
  dbName: string,
  db: DataSource
): Promise<void> {
  console.log('exec: summa-contra-gentiles db creation');

  console.log('creating book 1');
  const book1Html = await loadScgHtml(appName, dbName, 'scg-1.txt');
  const book1 = new SummaContraGentilesBookBuilder({
    bookNumber: 1,
    bookName: 'God',
    em: db.manager,
    rawData: book1Html,
    chaptersMixedTitles: false,
  })
    .buildChapters()
    .buildParagraphs().book;
  console.log('created book 1');

  const book2Html = await loadScgHtml(appName, dbName, 'scg-2.txt');
  console.log('creating book 2');
  const book2 = new SummaContraGentilesBookBuilder({
    bookNumber: 2,
    bookName: 'Creation',
    em: db.manager,
    rawData: book2Html,
    chaptersMixedTitles: false,
  })
    .buildChapters()
    .buildParagraphs().book;
  console.log('created book 2');

  const book3aHtml = await loadScgHtml(appName, dbName, 'scg-3a.txt');
  const book3bHtml = await loadScgHtml(appName, dbName, 'scg-3b.txt');
  console.log('creating book 3');
  const book3 = new SummaContraGentilesBookBuilder({
    bookNumber: 3,
    bookName: 'Providence',
    em: db.manager,
    rawData: book3aHtml,
    chaptersMixedTitles: true,
  })
    .buildChapters()
    .buildParagraphs()
    .mergeContinuedChapter(book3bHtml)
    .buildChapters()
    .buildParagraphs().book;
  console.log('created book 3');

  const book4Html = await loadScgHtml(appName, dbName, 'scg-4.txt');
  console.log('creating book 4');
  const book4 = new SummaContraGentilesBookBuilder({
    bookNumber: 4,
    bookName: 'Salvation',
    em: db.manager,
    rawData: book4Html,
    chaptersMixedTitles: true,
  })
    .buildChapters()
    .buildParagraphs().book;
  console.log('created book 4');

  console.log('saving to DB');
  await db.manager.save([book1, book2, book3, book4], { transaction: true });

  console.log('exec: summa-contra-gentiles completed');
}

async function loadScgHtml(appName: string, dbName: string, filename: string) {
  const partFilePath = PathUtils.resolveToCwd(
    process.env.RAW_DATA_DIRECTORY,
    `/${appName}/${dbName}/${filename}`
  );

  return fs.readFileSync(partFilePath, { encoding: 'utf8' });
}
