import { ArticleContent } from '@database';
import { AquinasBotAppCtx, SummaTheologicaQuery } from '@shared/types';
import { IsNull } from 'typeorm';
import { SummaTheologicaBuilder } from '../builders';

export class QuerySummaTheologicaService {
  constructor(public readonly appCtx: AquinasBotAppCtx) {}

  public async getSummaTheologicaEntry(
    parameters: SummaTheologicaQuery
  ): Promise<ArticleContent> {
    const articleContentRepo =
      this.appCtx.databases['summa-theologica'].getRepository(ArticleContent);

    console.log(
      `SERVICE=${
        QuerySummaTheologicaService.name
      } MSG=querying for ${SummaTheologicaBuilder.buildStCitation(parameters)}`
    );
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
}
