import {
  Part,
  PartValue,
  PartName,
  PartPrologue,
  Question,
  QuestionPrologue,
  Article,
  ArticleContent,
} from '@models';
import { SummaTheologicaQuery } from '@shared/types';
import { NumberUtils, StringUtils } from '@shared/utilities';
import { EntityManager } from 'typeorm';

interface SummaTheologicaOptions {
  /** the text file contents */
  rawData: string;
  em: EntityManager;
  part: PartValue;
}

const commonDelimiter = '_______________________\n\n';

const searchRules = {
  // will build prologues if exists
  prologues: { begin: commonDelimiter + 'PROLOGUE', end: commonDelimiter },
  // will build list of questions and their titles
  questionList: {
    I: { begin: 'FIRST PART (QQ. 1-119)\n\nQuestion', end: commonDelimiter },
    'I-II': {
      begin: 'FIRST PART OF THE SECOND PART (QQ. 1-114)\n\nQuestion',
      end: commonDelimiter,
    },
    'II-II': {
      begin: 'SECOND PART OF THE SECOND PART (QQ. 1-189)\n\nQuestion',
      end: commonDelimiter,
    },
    III: { begin: 'THIRD PART (QQ. 1-90)\n\nQuestion', end: commonDelimiter },
  },
  createQuestionDelimiter: (questionNumber: number) =>
    `QUESTION ${questionNumber}`,
  createCitation: (
    part: PartValue,
    questionNumber: number,
    articleNumber: number
  ) => `[${part}, Q. ${questionNumber}, Art. ${articleNumber}]`,
  articleContents: {
    objections: 'Obj',
    contrary: '_On the contrary,_',
    response: '_I answer that,_',
    replies: 'Reply Obj.',
  },
};

/**
 * @important this is implemented around parsing the summa theologica obtained from project gutenberg's copy
 * please consult that version to obtain the reasons around the parsing rules
 *
 * This is a very top down approach, everything starts at Part and works down to build the elements of the Part.
 * If calling individual methods that build related data (e.g. buildQuestionPrologues), its dependent on there being questions first
 *
 * Since its a one time thing of loading the data and such, nothing is quite optimized for performance
 */

// don't like how tied to typeorm this is
export class SummaTheologicaBuilder {
  // with the relations we can use the single part and populate the rest of it
  public part: Part;

  constructor(private readonly options: SummaTheologicaOptions) {
    // inits the part
    this.part = this.entityManager.create(Part, {
      value: this.options.part,
      name: this.getPartNameFromValue(this.options.part),
      questions: [],
    });
  }

  private get text() {
    return this.options.rawData;
  }

  private get entityManager() {
    return this.options.em;
  }

  /** builds the part object along with its prologue */
  public buildPrologue(): SummaTheologicaBuilder {
    // doesn't exist for this part
    if (this.part.value === 'II-II') return this;
    const { begin, end } = searchRules.prologues;

    const prologue = StringUtils.lineJoiner(
      StringUtils.substringByDelimiters(this.text, begin, end)
    );

    this.part.prologue = this.entityManager.create(PartPrologue, {
      content: prologue,
    });

    return this;
  }

  public buildQuestions(): SummaTheologicaBuilder {
    const { begin, end } = searchRules.questionList[this.options.part];

    const questionsSection = StringUtils.substringByDelimiters(
      this.text,
      begin,
      end
    );

    this.part.questions = questionsSection
      .split('\n')
      .filter((line) => line.length > 0 && line.match(/^[0-9]/))
      .map((question) => question.split('. '))
      .map(([number, title]) =>
        this.entityManager.create(Question, {
          questionNumber: Number(number),
          title: title.trim(),
          articles: [],
        })
      );

    return this;
  }

  public buildQuestionPrologues(): SummaTheologicaBuilder {
    for (const question of this.part.questions) {
      const questionDelimiter = searchRules.createQuestionDelimiter(
        question.questionNumber
      );

      const content = StringUtils.lineJoiner(
        StringUtils.substringByDelimiters(
          this.text,
          questionDelimiter,
          commonDelimiter
        )
      );
      question.prologue = this.entityManager.create(QuestionPrologue, {
        content,
      });
    }

    return this;
  }

  public buildArticles(): SummaTheologicaBuilder {
    // since we do have the number of articles in each question prologue we can grab that there
    // then we can parse using the citation [I, Q. 1, Art. 1]
    for (const question of this.part.questions) {
      const prologueContent = question.prologue.content;
      // should be the first in the list any subsequent just article numberings like (3)
      const matches = prologueContent.match(/\(([^()]*)\)/gm);
      if (!matches || !matches[0])
        throw new Error(
          `Dev Error: Error parsing the number of articles from question prologue for question # ${question.questionNumber}`
        );

      const numberOfArticles =
        NumberUtils.wordNumberMap[
          matches[0].toLowerCase().replace('(in ', '').replace(' articles)', '')
        ];

      question.articles = new Array(numberOfArticles).fill(null).map((_, i) => {
        const articleNumber = i + 1;
        // extract article title
        const citation =
          searchRules.createCitation(
            this.part.value,
            question.questionNumber,
            articleNumber
          ) + '\n';

        const title = StringUtils.substringByDelimiters(
          this.text,
          citation,
          '\n\n'
        ).trim();

        return this.entityManager.create(Article, {
          title,
          articleNumber: i + 1,
          articleContents: [],
        });
      });
    }

    return this;
  }

  public buildArticleContents(): SummaTheologicaBuilder {
    for (const question of this.part.questions) {
      for (const article of question.articles) {
        const citation =
          searchRules.createCitation(
            this.part.value,
            question.questionNumber,
            article.articleNumber
          ) + `\n\n${article.title}`;

        const {
          articleContents: { objections, contrary, replies, response },
        } = searchRules;

        const articleChunks = StringUtils.lineJoiner(
          StringUtils.substringByDelimiters(
            this.text,
            citation,
            commonDelimiter
          )
        )
          .split('\n\n')
          .reduce((acc, curr) => {
            if (
              [objections, contrary, replies, response].every(
                (str) => !curr.startsWith(str)
              )
            ) {
              acc[acc.length - 1] = acc[acc.length - 1] + `\n\n${curr}`;
              return acc;
            }
            acc.push(curr);
            return acc;
          }, []);

        for (const articleContent of articleChunks) {
          article.articleContents.push(
            this.createArticleContentFromString(articleContent)
          );
        }
      }
    }

    return this;
  }

  private getPartNameFromValue(value: PartValue): PartName {
    switch (value) {
      case 'I':
        return 'First Part (Prima Pars)';
      case 'I-II':
        return 'First Part of the Second Part (Prima Secundæ Partis)';
      case 'II-II':
        return 'Second Part of the Second Part (Secunda Secundæ Partis)';
      case 'III':
        return 'Third Part (Tertia Pars)';
    }
  }

  private createArticleContentFromString(content: string): ArticleContent {
    const newArticleContent = this.entityManager.create(ArticleContent, {
      subSection: null,
      subSectionValue: null,
      content: null,
    });

    const {
      articleContents: { objections, contrary, replies, response },
    } = searchRules;

    if (content.startsWith(objections)) {
      newArticleContent.subSection = 'arg.';
      const startOfText = content.indexOf(':');
      const [, value] = content.substring(0, startOfText).split(' ');
      newArticleContent.subSectionValue = Number(value);
      newArticleContent.content = content.substring(startOfText + 2);
    }

    if (content.startsWith(contrary)) {
      newArticleContent.subSection = 's. c.';
      newArticleContent.content = content;
    }

    if (content.startsWith(response)) {
      newArticleContent.subSection = 'co.';
      newArticleContent.content = content;
    }

    if (content.startsWith(replies)) {
      newArticleContent.subSection = 'ad.';
      const startOfText = content.indexOf(':');
      // some are just like 'Reply Obj. 1 is clear from the foregoing.'
      if (startOfText === -1) {
        const [, , value] = content.split(' ');
        newArticleContent.subSectionValue = Number(value);
        newArticleContent.content = content;
      } else {
        const [, , value] = content.substring(0, startOfText).split(' ');
        newArticleContent.subSectionValue = Number(value);
        newArticleContent.content = content.substring(startOfText + 2);
      }
    }

    return newArticleContent;
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
