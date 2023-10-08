import { StringUtils } from './StringUtils';

describe('StringUtils', () => {
  describe('lineJoiner', () => {
    const complexText = `
Because the Master of Catholic Truth ought not only to teach the
proficient.
    
Endeavoring to avoid these and other like faults, we shall try, by
God's help.


broke

new paragraph

new paragraph added special characters
-31389831@#$@$
`;

    test.each([
      [
        complexText,
        "Because the Master of Catholic Truth ought not only to teach the proficient.\n\nEndeavoring to avoid these and other like faults, we shall try, by God's help.\n\nbroke\n\nnew paragraph\n\nnew paragraph added special characters -31389831@#$@$",
      ],
      [null, ''],
      [undefined, ''],
      ['', ''],
      [
        `
test  

new paragraph  
`,
        'test\n\nnew paragraph',
      ],
    ])(
      'will join the lines and retain the necessary line breaks',
      (text, expected) => {
        expect(StringUtils.lineJoiner(text)).toEqual(expected);
      }
    );
  });
});
