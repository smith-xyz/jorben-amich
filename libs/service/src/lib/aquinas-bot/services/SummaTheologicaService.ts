import { ArticleContent } from '@models';
import { AquinasBotAppCtx, SummaTheologicaQuery } from '@shared/types';
import { IsNull } from 'typeorm';
import { Log } from '@shared/utilities';

const loggingFormatter = (
  serviceName: string,
  methodName: string,
  parameters: SummaTheologicaQuery
) =>
  `SERVICE=${serviceName} METHOD=${methodName} MSG=querying for ${SummaTheologicaService.buildStCitation(
    parameters
  )}`;

export class SummaTheologicaService {
  constructor(private readonly appCtx: AquinasBotAppCtx) {}

  @Log('log', loggingFormatter)
  public async getSummaTheologicaEntry(
    parameters: SummaTheologicaQuery
  ): Promise<ArticleContent> {
    const articleContentRepo =
      this.appCtx.databases['summa-theologica'].getRepository(ArticleContent);

    const { part, questionNumber, articleNumber, subSection, subSectionValue } =
      parameters;

    return articleContentRepo.findOne({
      where: {
        subSection,
        subSectionValue: subSectionValue || IsNull(),
        article: {
          articleNumber,
          question: { questionNumber, part: { value: part } },
        },
      },
      relations: { article: true },
    });
  }

  public static buildStCitation({
    part,
    questionNumber,
    articleNumber,
    subSection,
    subSectionValue,
  }: SummaTheologicaQuery): string {
    let citation = `ST ${part}, Q. ${questionNumber}, Art. ${articleNumber}, ${subSection}`;
    if (subSectionValue) citation += ` ${subSectionValue}`;
    return citation;
  }
}
