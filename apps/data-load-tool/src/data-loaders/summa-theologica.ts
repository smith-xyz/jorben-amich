import { SummaTheologicaBuilder } from '@service';
import { Part, PartValue } from '@database';
import { PathUtils } from '@shared/utilities';
import fs from 'fs';
import { DataSource } from 'typeorm';

export async function loadSummaTheologicaData(
  appName: string,
  dbName: string,
  db: DataSource
): Promise<void> {
  console.log('exec: summa-theologica db creation');
  await loadStPart(appName, dbName, db, 'I');
  await loadStPart(appName, dbName, db, 'I-II');
  await loadStPart(appName, dbName, db, 'II-II');
  await loadStPart(appName, dbName, db, 'III');
  console.log('exec: summa-theologica completed');
}

async function loadStPart(
  appName: string,
  dbName: string,
  db: DataSource,
  part: PartValue
): Promise<void> {
  console.log(`exec data load of ST Part ${part}`);

  const partFilePath = PathUtils.resolveToCwd(
    process.env.RAW_DATA_DIRECTORY,
    `/${appName}/${dbName}/${part}.txt`
  );

  console.log(`opening file path ${partFilePath}`);

  const rawData = fs.readFileSync(partFilePath, { encoding: 'utf8' });

  if (!rawData || rawData.length === 0) {
    throw new Error(
      `Error reading file from path: ${partFilePath}, error: no content`
    );
  }

  let newPart: Part;
  const em = db.manager;

  try {
    newPart = new SummaTheologicaBuilder({
      em,
      part,
      rawData,
    })
      .buildPrologue()
      .buildQuestions()
      .buildQuestionPrologues()
      .buildArticles()
      .buildArticleContents().part;
  } catch (err) {
    throw new Error(`${SummaTheologicaBuilder.name} ERROR = ${err.message}`);
  }

  try {
    await em.save(newPart, { transaction: true });
  } catch (err) {
    throw new Error(`DATABASE ERROR = ${err.message}`);
  }
}
