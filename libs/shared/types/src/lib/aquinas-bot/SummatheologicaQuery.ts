import { PartValue, SubSection } from '@models';

export interface SummaTheologicaQuery {
  part: PartValue;
  questionNumber: number;
  articleNumber: number;
  subSection: SubSection;
  subSectionValue: number | null;
}
