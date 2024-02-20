import { ArticleContent, partValueToHyperlinkPart } from '@models';
import {
  AquinasBotAppCtx,
  AquinasBotSearchParams,
  SummaTheologicaQuery,
  FTS5SearchResult,
} from '@shared/types';
import { IsNull } from 'typeorm';
import { Log } from '@shared/utilities';

const loggingFormatter = (
  serviceName: string,
  methodName: string,
  parameters: SummaTheologicaQuery
) =>
  `SERVICE=${serviceName} METHOD=${methodName} MSG=querying for ${SummaTheologicaService.buildCitation(
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

  /** @todo would be nice to not embed sql here */
  @Log('log')
  public async search({
    searchText,
    useNear,
  }: AquinasBotSearchParams): Promise<
    FTS5SearchResult<SummaTheologicaQuery>[]
  > {
    const matchParam = useNear
      ? `NEAR("${searchText}", 10)`
      : `"${searchText}"`;

    return this.appCtx.databases['summa-theologica'].query<
      FTS5SearchResult<SummaTheologicaQuery>[]
    >(
      `
      SELECT
        rank,
        ac.content,
        p.value as part,
        q.questionNumber,
        a.articleNumber,
        ac.subSection,
        ac.subSectionValue 
      FROM
        article_content ac
      JOIN article_fts f ON
        ac.ROWID = f.ROWID
      JOIN article a ON
        a.id = ac.articleId
      JOIN question q ON
        a.questionId = q.id
      JOIN part p ON
        p.id = q.partId
      WHERE
        article_fts MATCH ?
      ORDER BY rank;
    `,
      [matchParam]
    );
  }

  public static buildCitation({
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

  public static buildCitationWithHyperlink({
    part,
    questionNumber,
    articleNumber,
    subSection,
    subSectionValue,
  }: SummaTheologicaQuery): string {
    const citation = SummaTheologicaService.buildCitation({
      part,
      questionNumber,
      articleNumber,
      subSection,
      subSectionValue,
    });
    const partParam = partValueToHyperlinkPart[part];
    const questionnNumberParam =
      questionNumber < 100 ? `0${questionNumber}` : questionNumber;
    return `[${citation}](https://isidore.co/aquinas/english/summa/${partParam}/${partParam}${questionnNumberParam}.html#${partParam}Q${questionNumber}A${articleNumber}THEP1)`;
  }
}
