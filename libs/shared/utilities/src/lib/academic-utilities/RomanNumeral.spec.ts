import { RomanNumeral } from './RomanNumeral';

describe('RomanNumerals', () => {
  describe('numberToRomanNumeral', () => {
    test.each([
      [1, 'I'],
      [2, 'II'],
      [4, 'IV'],
      [8, 'VIII'],
      [9, 'IX'],
      [18, 'XVIII'],
      [357, 'CCCLVII'],
    ])(
      'give the number %i the correct roman numeral %p is returned',
      (value, expected) => {
        expect(RomanNumeral.numberToRomanNumeral(value)).toEqual(expected);
      }
    );
  });

  describe('romanNumeralToNumber', () => {
    test.each([
      [1, 'I'],
      [2, 'II'],
      [4, 'IV'],
      [8, 'VIII'],
      [9, 'IX'],
      [18, 'XVIII'],
      [357, 'CCCLVII'],
    ])(
      'give the number %i the correct roman numeral %p is returned',
      (expected, value) => {
        expect(RomanNumeral.romanNumeralToNumber(value)).toEqual(expected);
      }
    );
  });
});
