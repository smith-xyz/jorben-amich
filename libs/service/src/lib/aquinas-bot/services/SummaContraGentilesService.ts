import { SCGParagraph } from '@models';
import {
  AquinasBotAppCtx,
  AquinasBotSearchParams,
  SummaContraGentilesQuery,
  FTS5SearchResult,
} from '@shared/types';
import { Log, RomanNumeral } from '@shared/utilities';

const loggingFormatter = (
  serviceName: string,
  methodName: string,
  parameters: SummaContraGentilesQuery
) =>
  `SERVICE=${serviceName} METHOD=${methodName} MSG=querying for ${SummaContraGentilesService.buildCitation(
    parameters
  )}`;

export class SummaContraGentilesService {
  constructor(private readonly appCtx: AquinasBotAppCtx) {}

  @Log('log', loggingFormatter)
  public async getSummaContraGentilesParagraph(
    parameters: SummaContraGentilesQuery
  ): Promise<SCGParagraph> {
    const paragraphRepo =
      this.appCtx.databases['summa-contra-gentiles'].getRepository(
        SCGParagraph
      );

    const { book, chapter, paragraph } = parameters;

    return paragraphRepo.findOne({
      where: {
        paragraphNumber: paragraph,
        chapter: { chapterNumber: chapter, book: { bookNumber: book } },
      },
      relations: { chapter: true, latinParagraph: true },
    });
  }

  /** @todo would be nice to not embed sql here */
  @Log('log')
  public async search({
    searchText,
    useNear,
  }: AquinasBotSearchParams): Promise<
    FTS5SearchResult<SummaContraGentilesQuery>[]
  > {
    const matchParam = useNear
      ? `NEAR("${searchText}", 10)`
      : `"${searchText}"`;

    return this.appCtx.databases['summa-contra-gentiles'].query<
      FTS5SearchResult<SummaContraGentilesQuery>[]
    >(
      `
      SELECT
        rank,
        p.content,
        b.bookNumber as book,
        c.chapterNumber as chapter,
        p.paragraphNumber as paragraph
      FROM
        paragraph p
      JOIN paragraph_fts pf ON
        p.ROWID = pf.ROWID
      JOIN chapter c ON
        c.id = p.chapterId
      JOIN book b ON
        b.id = c.bookId
      WHERE
        paragraph_fts MATCH ?
      ORDER BY rank;
    `,
      [matchParam]
    );
  }

  public static buildCitation({
    book,
    chapter,
    paragraph,
  }: SummaContraGentilesQuery) {
    return `SCG ${RomanNumeral.numberToRomanNumeral(
      book
    )}.${chapter}.${paragraph}`;
  }

  public static buildCitationWithHyperlink({
    book,
    chapter,
    paragraph,
  }: SummaContraGentilesQuery) {
    const citation = SummaContraGentilesService.buildCitation({
      book,
      chapter,
      paragraph,
    });
    if (book !== 3) {
      return `[${citation}](https://isidore.co/aquinas/ContraGentiles${book}.htm#${chapter})`;
    }

    const bookSubSection = chapter > 83 ? 'b' : 'a';
    return `[${citation}](https://isidore.co/aquinas/ContraGentiles${book}${bookSubSection}.htm#${chapter})`;
  }
}
