function toRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];
  let result = "";
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }
  return result;
}

/**
 * Returns a Roman numeral century label for positive century-boundary years
 * (e.g. 1800 → "XIX", 1900 → "XX", 2000 → "XXI").
 * Returns null for all other years (including negatives).
 */
export function romanCenturyLabel(date: Date): string | null {
  const year = date.getFullYear();
  if (year > 0 && year % 100 === 0) {
    return toRoman(Math.floor(year / 100) + 1);
  }
  return null;
}
