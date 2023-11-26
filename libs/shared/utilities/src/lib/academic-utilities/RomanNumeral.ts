const romanSymbols = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

const numberToRomanSymbols: Record<number, string> = Object.entries(
  romanSymbols
).reduce((acc, curr) => {
  const [roman, num] = curr;
  acc[num] = roman;
  return acc;
}, {});

export function numberToRomanNumeral(value: number) {
  if (value === 0) return null;
  if (numberToRomanSymbols[value]) return numberToRomanSymbols[value];
  for (const key in romanSymbols) {
    if (value >= romanSymbols[key] && value > 0) {
      value = value - romanSymbols[key];
      return key + numberToRomanNumeral(value);
    }
  }
}

export function romanNumeralToNumber(romanNumeral: string) {
  if (romanNumeral === '' || !romanNumeral) return 0;
  for (const key in romanSymbols) {
    if (romanNumeral.indexOf(key) === 0) {
      romanNumeral = romanNumeral.replace(key, '');
      return romanSymbols[key] + parseInt(romanNumeralToNumber(romanNumeral));
    }
  }
}

export const RomanNumeral = {
  numberToRomanNumeral,
  romanNumeralToNumber,
};
