import {
  Article,
  ArticleContent,
  Part,
  PartPrologue,
  partValueToHyperlinkPart,
  Prologue,
  Question,
  QuestionPrologue,
  PartName,
  PartValue,
  SubSection,
} from './summa-theologica';

import {
  SCGBook,
  SCGChapter,
  SCGParagraph,
  SCGParagraphLatin,
} from './summa-contra-gentiles';

export function getSummaTheologicaEntities() {
  return [
    Article,
    ArticleContent,
    Part,
    PartPrologue,
    Prologue,
    Question,
    QuestionPrologue,
  ];
}

export function getSummaContraGentilesEntites() {
  return [SCGBook, SCGChapter, SCGParagraph, SCGParagraphLatin];
}

export {
  Article,
  ArticleContent,
  Part,
  PartPrologue,
  Prologue,
  Question,
  QuestionPrologue,
  PartName,
  PartValue,
  partValueToHyperlinkPart,
  SubSection,
  SCGBook,
  SCGChapter,
  SCGParagraph,
  SCGParagraphLatin,
};
