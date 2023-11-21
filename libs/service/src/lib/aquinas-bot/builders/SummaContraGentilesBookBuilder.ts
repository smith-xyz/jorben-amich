import { SCGBook, SCGChapter, SCGParagraph, SCGParagraphLatin } from '@models';
import { EntityManager } from 'typeorm';
import { JSDOM } from 'jsdom';
import { StringUtils } from '@shared/utilities';

export interface SummaContraGentilesBookBuilderOptions {
  /** the text file contents */
  rawData: string;
  em: EntityManager;
  bookNumber: number;
  bookName: string;
  chaptersMixedTitles: boolean;
}

// TBD - may just be faster to copy and paste the text
export class SummaContraGentilesBookBuilder {
  public book: SCGBook;

  private tableHtmlCollection: HTMLCollectionOf<HTMLTableElement>;
  private chapterSetIndex = 0;
  // note the groups to grab the number value
  private paragraphNumberRegex = /^\[(\d+)\]/;

  constructor(private readonly options: SummaContraGentilesBookBuilderOptions) {
    // inits the part
    this.book = this.entityManager.create(SCGBook, {
      bookNumber: options.bookNumber,
      name: options.bookName,
      chapters: [],
    });

    const dom = new JSDOM(this.text);
    this.tableHtmlCollection =
      dom.window.document.getElementsByTagName('table');
  }

  private get text() {
    return this.options.rawData;
  }

  private get entityManager() {
    return this.options.em;
  }

  public mergeContinuedChapter(rawData: string) {
    this.options.rawData = rawData;
    const dom = new JSDOM(rawData);
    this.tableHtmlCollection =
      dom.window.document.getElementsByTagName('table');

    // set where we are in the chapters
    this.chapterSetIndex = this.book.chapters.length;
    return this;
  }

  public buildChapters() {
    const chaptersListTable = this.tableHtmlCollection.item(0);
    const chaptersList = Array.from(
      chaptersListTable.getElementsByTagName('a')
    ).map((el, i) =>
      this.entityManager.create(SCGChapter, {
        //book: this.book, <-- causes heap memory problems
        chapterNumber: i + 1 + this.chapterSetIndex,
        paragraphs: [],
        title: el.textContent,
        latinTitle: null, // we will get this later
        openingVerse: null, // we will get this later
        latinOpeningVerse: null, // we will get this later
      })
    );

    this.book.chapters.push(...chaptersList);

    return this;
  }

  public buildParagraphs() {
    // [[chapterNumber, html]]
    const chapterMap = new Map(
      Array.from(this.tableHtmlCollection)
        .splice(1)
        .map((el, i) => [
          i + 1 + this.chapterSetIndex,
          Array.from(el.getElementsByTagName('tr')).slice(
            this.options.chaptersMixedTitles ? 0 : 1
          ),
        ])
    );

    const tempChapterCollection = new Map<number, [string, string][]>();

    // splitting up the work
    for (const [chapterNumber, tableRows] of chapterMap) {
      const tempCollection = [];

      for (const tr of tableRows) {
        tempCollection.push(
          ...Array.from(tr.getElementsByTagName('td')).map((el) => {
            if (
              this.options.chaptersMixedTitles &&
              (el.textContent.toLowerCase().startsWith('chapter') ||
                el.textContent.toLowerCase().startsWith('caput'))
            ) {
              return StringUtils.removeExcessiveSpace(el.textContent)
                .replace(/^Caput\s\d+\s/i, '')
                .replace(/^Chapter\s\d+\s/i, '')
                .trim();
            }
            return StringUtils.toStringOrDefault(el.textContent);
          })
        );
      }

      // split the collection into chunks of two
      const chunkArray = [];
      const chunksize = 2;

      while (tempCollection.length) {
        const chunk = tempCollection.splice(0, chunksize);
        chunkArray.push(chunk);
      }

      tempChapterCollection.set(chapterNumber, chunkArray);
    }

    for (const [chapterNumber, chunks] of tempChapterCollection) {
      const currentChapter = this.book.chapters[chapterNumber - 1];

      let currentParagraphNumber = 0;

      for (const [latin, english] of chunks) {
        // check if first chunk is an opening verse
        const hasParagraphNumber = this.paragraphNumberRegex.test(english);
        const nonParagraphContent =
          currentParagraphNumber === 0 && !hasParagraphNumber;

        // if we haven't set the first and we see it doesn't have a paragraph number, assuming opening verse
        if (nonParagraphContent) {
          // check if its the latin title by seeing if the we have the english one otherwise set opening verse, hopefully this logic works
          const trimmedValue = StringUtils.removeExcessiveSpace(
            english.toLowerCase()
          );
          const currentChapterTitleToLowerCase =
            currentChapter.title.toLowerCase();

          trimmedValue === currentChapterTitleToLowerCase ||
          currentChapterTitleToLowerCase.includes(trimmedValue) ||
          trimmedValue.includes(currentChapterTitleToLowerCase)
            ? (currentChapter.latinTitle = latin)
            : (currentChapter.openingVerse = english) &&
              (currentChapter.latinOpeningVerse = latin);
          continue;
        }
        // check if chunk starts with paragraph number e.g. "[1]" in english version only
        if (hasParagraphNumber) {
          currentParagraphNumber = Number(
            english.match(this.paragraphNumberRegex)[1]
          );
          // setup the first chunk
          const paragraph = this.entityManager.create(SCGParagraph, {
            latinParagraph: latin
              ? this.entityManager.create(SCGParagraphLatin, {
                  content: latin,
                  paragraph: null,
                })
              : null,
            paragraphNumber: currentParagraphNumber,
            content: english.replace(this.paragraphNumberRegex, '').trimStart(),
          });
          currentChapter.paragraphs.push(paragraph);
        } else {
          // we append to the existing paragraph
          const currentParagraph = currentChapter.paragraphs.find(
            (paragraph) => paragraph.paragraphNumber === currentParagraphNumber
          );
          currentParagraph.content = currentParagraph.content + english;
          currentParagraph.latinParagraph.content =
            currentParagraph.latinParagraph.content + latin;
        }
      }
    }

    return this;
  }
}
