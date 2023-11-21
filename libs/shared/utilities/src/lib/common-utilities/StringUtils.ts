/**
 * @description returns string where sentences are joined and paragraph line breaks are retained
 * @param text
 * @returns {string} formatted string
 * @todo I'm sure there is a better way to solve this :)
 */
function lineJoiner(text: string): string {
  if (!text || !text.length) return '';
  return text
    .trim()
    .split(/^/gm)
    .map((line, i, arr) => {
      // trimStart prevents line break from removed
      const formatted = line.trimStart();
      const next = arr[i + 1];
      const nextLineIsLineBreak = next && next.trimStart().length === 0;

      // check if next line is text that should join by adding space
      if (formatted.endsWith('\n') && !nextLineIsLineBreak) {
        return formatted.replace('\n', ' ');
      }
      if (formatted.endsWith('\n') && nextLineIsLineBreak) {
        return formatted.trim() + '\n';
      }
      // any duplicated space is checked and removed here
      if (formatted.length === 0 && nextLineIsLineBreak) return '';

      if (formatted.length === 0) return '\n';

      // just as a default
      return formatted;
    })
    .join('');
}

/** use to extract a chunk of a substring between two delimiters */
function substringByDelimiters(
  text: string,
  startDelimiter: string,
  endDelimiter: string
): string {
  const startIndex = text.indexOf(startDelimiter);
  let result = text.substring(startIndex);
  if (startIndex === -1)
    throw new Error(
      `DEV ERROR: Unable to parse substring by delimiters ${JSON.stringify({
        startDelimiter,
        endDelimiter,
      })}`
    );
  // remove delimiter from text
  result = result.replace(startDelimiter, '');
  const endIndex = result.indexOf(endDelimiter);
  if (endIndex === -1)
    throw new Error(
      `DEV ERROR: Unable to parse substring by delimiters ${JSON.stringify({
        startDelimiter,
        endDelimiter,
      })}`
    );
  return result.substring(0, endIndex).replace(endDelimiter, '');
}

function toStringOrDefault(value: string, defaultValue: unknown = null) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : defaultValue;
}

function removeExcessiveSpace(value: string) {
  return value.replaceAll(/\s{2,}/g, ' ');
}

export const StringUtils = {
  lineJoiner,
  substringByDelimiters,
  toStringOrDefault,
  removeExcessiveSpace,
};
