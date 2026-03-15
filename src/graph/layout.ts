import type { TimelineSpan, TimelinePoint } from "../types";

function intersectsSpan(span1: TimelineSpan, span2: TimelineSpan): boolean {
  const s1 = span1.start;
  const e1 = span1.end;
  const s2 = span2.start;
  const e2 = span2.end;

  if (!e2 || !e1) {
    return false;
  }

  return s1 < e2 && s2 < e1;
}

function intersectsPoint(point: TimelinePoint, span: TimelineSpan): boolean {
  const d = point.date;
  const s = span.start;
  const e = span.end;
  if (!e) return false;
  return d >= s && d <= e;
}

const layout = {
  generate(
    spans: TimelineSpan[],
    points: TimelinePoint[] = [],
    maxLevel = 15,
  ): void {
    spans.forEach((e) => {
      e.duration = e.end ? e.end.getTime() - e.start.getTime() : 0;
    });
    spans.sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));

    const placed: TimelineSpan[] = [];
    spans.forEach((e) => {
      const occupiedLevels = new Set<number>();
      placed.forEach((p) => {
        if (intersectsSpan(e, p)) {
          occupiedLevels.add(p.level ?? 0);
        }
      });
      e.level = 0;
      while (occupiedLevels.has(e.level)) {
        e.level++;
      }
      placed.push(e);
    });

    spans.forEach((e) => {
      if (e.position === undefined) e.position = maxLevel - (e.level ?? 0);
    });

    // Layout points: avoid overlapping with spans
    points.forEach((pt) => {
      const occupiedLevels = new Set<number>();
      placed.forEach((span) => {
        if (intersectsPoint(pt, span)) {
          occupiedLevels.add(span.level ?? 0);
        }
      });
      pt.level = 0;
      while (occupiedLevels.has(pt.level)) {
        pt.level++;
      }
      if (pt.position === undefined) pt.position = maxLevel - (pt.level ?? 0);
    });
  },
};

export default layout;
