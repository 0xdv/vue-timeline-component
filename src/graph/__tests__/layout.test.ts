import { describe, it, expect } from "vitest";
import layout from "../layout";
import type { TimelineSpan, TimelinePoint } from "../../types";

function span(name: string, start: string, end?: string): TimelineSpan {
  return {
    name,
    start: new Date(start),
    end: end ? new Date(end) : undefined,
  };
}

function point(desc: string, date: string): TimelinePoint {
  return { description: desc, date: new Date(date) };
}

describe("layout", () => {
  describe("generate", () => {
    it("assigns duration to spans", () => {
      const spans = [span("A", "2000-01-01", "2000-06-01")];
      layout.generate(spans);

      expect(spans[0].duration).toBe(
        new Date("2000-06-01").getTime() - new Date("2000-01-01").getTime(),
      );
    });

    it("sets duration to 0 for spans without end", () => {
      const spans = [span("A", "2000-01-01")];
      layout.generate(spans);

      expect(spans[0].duration).toBe(0);
    });

    it("assigns level 0 to non-overlapping spans", () => {
      const spans = [
        span("A", "2000-01-01", "2000-06-01"),
        span("B", "2001-01-01", "2001-06-01"),
      ];
      layout.generate(spans);

      expect(spans[0].level).toBe(0);
      expect(spans[1].level).toBe(0);
    });

    it("assigns different levels to overlapping spans", () => {
      const spans = [
        span("A", "2000-01-01", "2001-01-01"),
        span("B", "2000-06-01", "2001-06-01"),
      ];
      layout.generate(spans);

      const levels = spans.map((s) => s.level);
      expect(new Set(levels).size).toBe(2);
    });

    it("assigns position based on maxLevel minus level", () => {
      const spans = [span("A", "2000-01-01", "2000-06-01")];
      layout.generate(spans);

      expect(spans[0].position).toBe(11 - (spans[0].level ?? 0));
    });

    it("sorts spans by duration descending before placement", () => {
      const short = span("Short", "2000-01-01", "2000-02-01");
      const long = span("Long", "2000-01-01", "2001-01-01");
      const spans = [short, long];
      layout.generate(spans);

      // The longer span is placed first (level 0)
      expect(long.level).toBe(0);
    });

    it("handles three overlapping spans", () => {
      const spans = [
        span("A", "2000-01-01", "2002-01-01"),
        span("B", "2000-06-01", "2001-06-01"),
        span("C", "2001-01-01", "2001-12-01"),
      ];
      layout.generate(spans);

      const levels = new Set(spans.map((s) => s.level));
      // All three overlap at some point, so expect 2-3 distinct levels
      expect(levels.size).toBeGreaterThanOrEqual(2);
    });

    it("handles empty spans array", () => {
      const spans: TimelineSpan[] = [];
      layout.generate(spans);

      expect(spans.length).toBe(0);
    });

    it("handles empty points array", () => {
      const spans = [span("A", "2000-01-01", "2000-06-01")];
      layout.generate(spans, []);

      expect(spans[0].level).toBe(0);
    });
  });

  describe("point layout", () => {
    it("assigns level and position to points", () => {
      const spans = [span("A", "2000-01-01", "2001-01-01")];
      const pts = [point("Event", "2000-06-01")];
      layout.generate(spans, pts);

      expect(pts[0].level).toBeDefined();
      expect(pts[0].position).toBeDefined();
    });

    it("avoids overlapping levels with spans", () => {
      const spans = [span("A", "2000-01-01", "2001-01-01")];
      const pts = [point("Event", "2000-06-01")];
      layout.generate(spans, pts);

      // Point overlaps with span so it should get a different level
      expect(pts[0].level).not.toBe(spans[0].level);
    });

    it("assigns level 0 when point does not overlap spans", () => {
      const spans = [span("A", "2000-01-01", "2000-06-01")];
      const pts = [point("Event", "2002-01-01")];
      layout.generate(spans, pts);

      expect(pts[0].level).toBe(0);
    });

    it("handles point at span boundary (start)", () => {
      const spans = [span("A", "2000-01-01", "2001-01-01")];
      const pts = [point("Start", "2000-01-01")];
      layout.generate(spans, pts);

      // Point at exact start of span – considered inside
      expect(pts[0].level).not.toBe(spans[0].level);
    });

    it("handles point at span boundary (end)", () => {
      const spans = [span("A", "2000-01-01", "2001-01-01")];
      const pts = [point("End", "2001-01-01")];
      layout.generate(spans, pts);

      // Point at exact end of span – considered inside
      expect(pts[0].level).not.toBe(spans[0].level);
    });

    it("handles multiple points with no spans", () => {
      const pts = [point("A", "2000-01-01"), point("B", "2000-06-01")];
      layout.generate([], pts);

      // All points get level 0 (no span conflicts)
      expect(pts[0].level).toBe(0);
      expect(pts[1].level).toBe(0);
    });
  });
});
