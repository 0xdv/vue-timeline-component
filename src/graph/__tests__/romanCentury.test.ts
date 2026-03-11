import { describe, it, expect } from "vitest";
import { romanCenturyLabel } from "../format/romanCentury";

describe("romanCenturyLabel", () => {
  it("returns Roman numeral for century boundary years", () => {
    expect(romanCenturyLabel(new Date("1800-01-01"))).toBe("XIX");
    expect(romanCenturyLabel(new Date("1900-01-01"))).toBe("XX");
    expect(romanCenturyLabel(new Date("2000-01-01"))).toBe("XXI");
  });

  it("returns null for non-century years", () => {
    expect(romanCenturyLabel(new Date("1999-01-01"))).toBeNull();
    expect(romanCenturyLabel(new Date("2001-01-01"))).toBeNull();
    expect(romanCenturyLabel(new Date("1850-01-01"))).toBeNull();
  });

  it("handles year 100 (2nd century)", () => {
    const date = new Date("0100-01-01");
    date.setFullYear(100);
    expect(romanCenturyLabel(date)).toBe("II");
  });

  it("handles year 200 (3rd century)", () => {
    const date = new Date("0200-01-01");
    date.setFullYear(200);
    expect(romanCenturyLabel(date)).toBe("III");
  });

  it("returns null for negative years", () => {
    const date = new Date("0001-01-01");
    date.setFullYear(-100);
    expect(romanCenturyLabel(date)).toBeNull();
  });

  it("returns null for year 0", () => {
    const date = new Date("0001-01-01");
    date.setFullYear(0);
    expect(romanCenturyLabel(date)).toBeNull();
  });

  it("handles large century years", () => {
    expect(romanCenturyLabel(new Date("3000-01-01"))).toBe("XXXI");
  });

  it("maps well-known centuries correctly", () => {
    const cases: [string, string][] = [
      ["0100-01-01", "II"],
      ["0300-01-01", "IV"],
      ["0500-01-01", "VI"],
      ["1000-01-01", "XI"],
      ["1400-01-01", "XV"],
      ["1700-01-01", "XVIII"],
    ];
    for (const [yearStr, expected] of cases) {
      const d = new Date(yearStr);
      d.setFullYear(parseInt(yearStr));
      expect(romanCenturyLabel(d)).toBe(expected);
    }
  });
});
