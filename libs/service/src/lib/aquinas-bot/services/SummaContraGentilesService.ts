import { SCGChapter, SCGParagraph, SCGParagraphLatin } from '@models';
import { AquinasBotAppCtx, SummaContraGentilesQuery } from '@shared/types';
import { Log, RomanNumeral } from '@shared/utilities';

const loggingFormatter = (
  serviceName: string,
  methodName: string,
  parameters: SummaContraGentilesQuery
) =>
  `SERVICE=${serviceName} METHOD=${methodName} MSG=querying for ${SummaContraGentilesService.queryToCitation(
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

  public static queryToCitation({
    book,
    chapter,
    paragraph,
  }: SummaContraGentilesQuery) {
    return `SCG ${RomanNumeral.numberToRomanNumeral(
      book
    )}.${chapter}.${paragraph}`;
  }
}
