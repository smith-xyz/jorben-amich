import fs from 'fs';
import path from 'path';
import { SummaTheologicaQuery } from '../interfaces';

export class QuerySummaTheologicaService {
  constructor(public readonly dataSource: string) {}

  public async getSummaTheologicaEntry(
    parameters: SummaTheologicaQuery
  ): Promise<string> {
    const { part, question, article, subsection } = parameters;
    const partFilePath = path.join(
      this.dataSource,
      `/summa-theologica/${part}.txt`
    );

    console.log(
      `Service=${QuerySummaTheologicaService.name}: opening file path ${partFilePath}`
    );
    const content = fs.readFileSync(partFilePath, { encoding: 'utf8' });

    if (!content || content.length === 0) {
      throw new Error(
        `Service Error=${QuerySummaTheologicaService.name}: reading file from path: ${partFilePath}, error: no content`
      );
    }

    // currently can search with this format: [I, Q. 118, Art. 2] and end with delimiter _______________________
    const startSearch = `[${part}, Q. ${question}, Art. ${article}]`;
    const endSearch = '_______________________';

    const startIndex = content.indexOf(startSearch);
    const endIndex = content.indexOf(endSearch, startIndex);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error(
        `Service Issue=${QuerySummaTheologicaService.name}: querying summa theologica at ${startSearch} not found`
      );
    }

    const articleSnippet = content.substring(startIndex, endIndex);
    const subsectionDelimiter = subsectionToDelimiter(subsection);

    const subsectionStartIndex = articleSnippet.indexOf(subsectionDelimiter);
    if (subsectionStartIndex === -1) {
      throw new Error(
        `Service Error=${QuerySummaTheologicaService.name}: querying summa theologica subsection starting at ${subsectionDelimiter}, search in ${startSearch} `
      );
    }
    const trimmedToSubsection = articleSnippet.substring(
      subsectionStartIndex,
      articleSnippet.length
    );

    const endDelimiters = subsectionToPotentialEndDelimiters(subsection);
    let subsectionEndIndex = -1;
    for (const delimiter of endDelimiters) {
      subsectionEndIndex = trimmedToSubsection.indexOf(
        delimiter,
        subsectionDelimiter.length
      );
      if (subsectionEndIndex !== -1) break;
    }

    if (subsectionEndIndex === -1) {
      throw new Error(
        `Service Error=${
          QuerySummaTheologicaService.name
        }: querying summa theologica subsection starting at ${subsectionDelimiter}, search for ending: ${endDelimiters.join(
          ','
        )},search in ${startSearch} `
      );
    }

    // the text doesn't have spaces at the end of the lines, so normalizing it here
    const result = trimmedToSubsection
      .substring(0, subsectionEndIndex)
      .split('\n')
      .map((line) => line + ' ')
      .join('');

    if (!result || !result.length) {
      throw new Error(
        `Service Error=${
          QuerySummaTheologicaService.name
        }: Failed Query: params=${JSON.stringify({
          startSearch,
          endIndex,
          subsectionDelimiter,
          subsectionStartIndex,
          endDelimiters,
          subsectionEndIndex,
        })}`
      );
    }

    console.log(
      `Service Success=${
        QuerySummaTheologicaService.name
      }: params=${JSON.stringify({
        startSearch,
        endIndex,
        subsectionDelimiter,
        subsectionStartIndex,
        endDelimiters,
        subsectionEndIndex,
      })}`
    );
    return result;
  }
}

/**
 * pr. — prologue to a question
 * arg. — objections
 * s. c. — “On the contrary”
 * co. — “I respond that”
 * ad. — replies to objections
 * if none provided, default is _I answer that or "co"
 */
function subsectionToDelimiter(subsection: string): string {
  subsection = subsection.toLowerCase();
  if (subsection.startsWith('co.')) return '_I answer that,_';
  if (subsection.startsWith('s.c.') || subsection.startsWith('s. c.'))
    return '_On the contrary,_';
  if (subsection.startsWith('arg.')) {
    const [, value] = subsection.split(' ');
    if (value === '1') return 'Objection 1:';
    return `Obj. ${value}:`;
  }
  if (subsection.startsWith('ad.')) {
    const [, value] = subsection.split(' ');
    return `Reply Obj. ${value}:`;
  }

  // co. and all others just get thomas' response
  return '_I answer that,_';
}

// can be a few options to determine the end of the snippet needed
function subsectionToPotentialEndDelimiters(subsection: string): string[] {
  subsection = subsection.toLowerCase();
  if (subsection.startsWith('co.')) return ['Reply Obj.'];
  if (subsection.startsWith('s.c.') || subsection.startsWith('s. c.'))
    return ['_I answer that,_'];
  if (subsection.startsWith('arg.')) return ['Obj.', '_On the contrary,_'];
  if (subsection.startsWith('ad.'))
    return ['Reply Obj.', '_______________________'];

  // co. and all others just get thomas' response
  return ['Reply Obj.'];
}
