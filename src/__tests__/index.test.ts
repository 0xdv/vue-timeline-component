import { describe, it, expect } from "vitest";
import {
  VueTimeline,
  isTimelineSpan,
  isTimelinePoint,
  TimelineSpan,
  TimelinePoint,
} from "../index";
import plugin from "../index";

describe("index exports", () => {
  it("exports VueTimeline component", () => {
    expect(VueTimeline).toBeDefined();
  });

  it("exports default plugin with install method", () => {
    expect(plugin).toBeDefined();
    expect(typeof plugin.install).toBe("function");
  });

  it("plugin.install registers VueTimeline component", () => {
    const registered: Record<string, unknown> = {};
    const mockApp = {
      component(name: string, comp: unknown) {
        registered[name] = comp;
      },
    };

    plugin.install!(mockApp as any);

    expect(registered["VueTimeline"]).toBe(VueTimeline);
  });

  it("exports isTimelineSpan and isTimelinePoint discriminators", () => {
    const span = new TimelineSpan("A", new Date());
    const point = new TimelinePoint(new Date(), "B");

    expect(isTimelineSpan(span)).toBe(true);
    expect(isTimelineSpan(point)).toBe(false);
    expect(isTimelinePoint(point)).toBe(true);
    expect(isTimelinePoint(span)).toBe(false);
  });
});
