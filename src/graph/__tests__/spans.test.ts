import { describe, it, expect, vi, beforeEach } from "vitest";
import * as d3 from "d3";
import { spansRenderer } from "../renderers/spans";
import type { TimelineSpan } from "../../types";

function createSvg() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return d3.select(container).append("svg").append("g");
}

function makeSpan(
  name: string,
  start: string,
  end: string,
  position = 0,
): TimelineSpan {
  return { name, start: new Date(start), end: new Date(end), position };
}

describe("spansRenderer", () => {
  let g: d3.Selection<SVGGElement, any, any, any>;
  let timeScale: d3.ScaleTime<number, number>;

  beforeEach(() => {
    document.body.innerHTML = "";
    g = createSvg();
    timeScale = d3
      .scaleTime()
      .domain([new Date("2000-01-01"), new Date("2002-01-01")])
      .range([0, 800]);
  });

  it("renders span groups for each data item", () => {
    const spans = [
      makeSpan("A", "2000-01-01", "2000-06-01"),
      makeSpan("B", "2001-01-01", "2001-06-01"),
    ];

    g.datum([spans, []]);
    g.call(spansRenderer({ timeScale }));

    const groups = g.selectAll("g.span");
    expect(groups.size()).toBe(2);
  });

  it("renders rect and text inside each span group", () => {
    const spans = [makeSpan("Test", "2000-01-01", "2001-01-01")];
    g.datum([spans, []]);
    g.call(spansRenderer({ timeScale }));

    const group = g.select("g.span");
    expect(group.select("rect").empty()).toBe(false);
    expect(group.select("text").text()).toBe("Test");
  });

  it("renders title (tooltip) with span name", () => {
    const spans = [makeSpan("My Span", "2000-01-01", "2001-01-01")];
    g.datum([spans, []]);
    g.call(spansRenderer({ timeScale }));

    expect(g.select("g.span title").text()).toBe("My Span");
  });

  it("calls onClick handler when span is clicked", () => {
    const onClick = vi.fn();
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    g.datum([spans, []]);
    g.call(spansRenderer({ timeScale, onClick }));

    const node = g.select("g.span").node() as Element;
    node.dispatchEvent(new MouseEvent("click"));

    expect(onClick).toHaveBeenCalled();
  });

  it("renders clip path for each span", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    g.datum([spans, []]);
    g.call(spansRenderer({ timeScale }));

    expect(g.select("clipPath").empty()).toBe(false);
  });

  it("handles empty spans array", () => {
    g.datum([[], []]);
    g.call(spansRenderer({ timeScale }));

    expect(g.selectAll("g.span").size()).toBe(0);
  });

  it("sets rect width based on time scale", () => {
    const spans = [makeSpan("A", "2000-01-01", "2001-01-01")];
    g.datum([spans, []]);
    g.call(spansRenderer({ timeScale }));

    const width = parseFloat(g.select("g.span rect").attr("width"));
    const expected =
      timeScale(new Date("2001-01-01")) - timeScale(new Date("2000-01-01"));
    expect(width).toBeCloseTo(expected, 1);
  });
});
