import { describe, it, expect, beforeEach } from "vitest";
import * as d3 from "d3";
import timeline from "../timeline";
import { TimelineSpan, TimelinePoint } from "../../types";

function makeSpan(name: string, start: string, end: string): TimelineSpan {
  return new TimelineSpan(name, new Date(start), new Date(end));
}

describe("timeline", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    // Need clientWidth for widthResizable
    Object.defineProperty(container, "clientWidth", { value: 600 });
    document.body.appendChild(container);
  });

  it("creates an SVG element inside the selection", () => {
    const spans: TimelineSpan[] = [makeSpan("A", "2000-01-01", "2001-01-01")];

    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    const chart = timeline({ viewWidth: 600, viewHeight: 200 });
    sel.call(chart);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("creates graph group inside SVG", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    sel.call(timeline({ viewWidth: 600, viewHeight: 200 }));

    expect(container.querySelector("g.graph")).not.toBeNull();
  });

  it("creates view group inside graph", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    sel.call(timeline({ viewWidth: 600, viewHeight: 200 }));

    expect(container.querySelector("g.view")).not.toBeNull();
  });

  it("renders spans inside the view", () => {
    const spans = [
      makeSpan("First", "2000-01-01", "2001-01-01"),
      makeSpan("Second", "2001-01-01", "2002-01-01"),
    ];
    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    sel.call(timeline({ viewWidth: 600, viewHeight: 200 }));

    const spanGroups = container.querySelectorAll("g.span");
    expect(spanGroups.length).toBe(2);
  });

  it("clears previous SVG on re-init", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    const chart = timeline({ viewWidth: 600, viewHeight: 200 });
    sel.call(chart);
    // Re-init
    chart._init?.();

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(1);
  });

  it("applies margin to graph transform", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    sel.call(
      timeline({
        viewWidth: 600,
        viewHeight: 200,
        widthResizable: false,
        margin: { top: 10, bottom: 20, left: 30, right: 40 },
      }),
    );

    const graph = container.querySelector("g.graph");
    expect(graph?.getAttribute("transform")).toBe("translate(30,10)");
  });

  it("renders with points data", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    const points: TimelinePoint[] = [
      new TimelinePoint(new Date("2000-06-01"), "Event"),
    ];
    const sel = d3
      .select(container)
      .datum([spans, points] as [TimelineSpan[], TimelinePoint[]]);

    sel.call(timeline({ viewWidth: 600, viewHeight: 200 }));

    expect(container.querySelectorAll("g.point").length).toBe(1);
  });

  it("uses default config values", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    const sel = d3
      .select(container)
      .datum([spans, []] as [TimelineSpan[], TimelinePoint[]]);

    // Pass empty config – should use defaults
    sel.call(timeline({}));

    expect(container.querySelector("svg")).not.toBeNull();
  });
});
