import type { TimelineEvent } from "./types";

function intersects(event1: TimelineEvent, event2: TimelineEvent): boolean {
  const s1 = event1.start;
  const e1 = event1.end;
  const s2 = event2.start;
  const e2 = event2.end;

  if (!e2 || !e1) {
    return false;
  }

  return (s2 < s1 && s1 < e2) || (s1 < s2 && s2 < e1);
}

const layout = {
  generate(data: TimelineEvent[]): void {
    data.forEach((e) => {
      e.duration = e.end ? e.end.getTime() - e.start.getTime() : 0;
    });
    data.sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));

    const placed: TimelineEvent[] = [];
    data.forEach((e) => {
      e.level = 0;
      placed.forEach((p) => {
        if (intersects(e, p)) {
          e.level = (e.level ?? 0) + 1;
        }
      });
      placed.push(e);
    });

    const maxLevel = 11;
    data.forEach((e) => (e.position = maxLevel - (e.level ?? 0)));
  },
};

export default layout;
