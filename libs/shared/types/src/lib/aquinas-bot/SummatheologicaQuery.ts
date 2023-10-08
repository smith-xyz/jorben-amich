import { PartValue, SubSection } from '@database';

export interface SummaTheologicaQuery {
  part: PartValue;
  questionNumber: number;
  articleNumber: number;
  subSection: SubSection;
  subSectionValue: number | null;
}
