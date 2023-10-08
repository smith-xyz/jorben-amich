import {
  Article,
  ArticleContent,
  Part,
  Question,
  PartPrologue,
  Prologue,
  QuestionPrologue,
} from './summa-theological';

/**
 * @description object that will reference data storage that will be a specific work
 */
export const aquinasDatabase = {
  'summa-theologica': {
    entities: [
      Article,
      ArticleContent,
      Part,
      Question,
      PartPrologue,
      QuestionPrologue,
      Prologue,
    ],
    // in the future if you need to add migrations we can add them here
  },
};

/** exposing entities */
export * from './summa-theological';
