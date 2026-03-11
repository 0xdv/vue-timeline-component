import { describe, it, expect, vi, beforeEach } from "vitest";
import * as d3 from "d3";
import { pointsRenderer } from "../renderers/points";
import { TimelinePoint } from "../../types";

function createSvg() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return d3.select(container).append("svg").append("g");
}

function makePoint(desc: string, date: string, position = 0): TimelinePoint {
  const p = new TimelinePoint(new Date(date), desc);
  p.position = position;
  return p;
}

describe("pointsRenderer", () => {
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

  it("renders point groups for each data item", () => {
    const spans: any[] = [];
    const points = [
      makePoint("Event A", "2000-06-01"),
      makePoint("Event B", "2001-06-01"),
    ];

    g.datum([spans, points]);
    g.call(pointsRenderer({ timeScale }));

    expect(g.selectAll("g.point").size()).toBe(2);
  });

  it("renders diamond polygon marker", () => {
    const points = [makePoint("Event", "2000-06-01")];
    g.datum([[], points]);
    g.call(pointsRenderer({ timeScale }));

    const polygon = g.select("g.point polygon");
    expect(polygon.empty()).toBe(false);
    expect(polygon.attr("points")).toBe("0,-8 8,0 0,8 -8,0");
  });

  it("renders text with point description", () => {
    const points = [makePoint("My Event", "2000-06-01")];
    g.datum([[], points]);
    g.call(pointsRenderer({ timeScale }));

    expect(g.select("g.point text").text()).toBe("My Event");
  });

  it("renders title (tooltip) with description", () => {
    const points = [makePoint("Tooltip Text", "2000-06-01")];
    g.datum([[], points]);
    g.call(pointsRenderer({ timeScale }));

    expect(g.select("g.point title").text()).toBe("Tooltip Text");
  });

  it("calls onClick handler when point is clicked", () => {
    const onClick = vi.fn();
    const points = [makePoint("Click Me", "2000-06-01")];
    g.datum([[], points]);
    g.call(pointsRenderer({ timeScale, onClick }));

    const node = g.select("g.point").node() as Element;
    node.dispatchEvent(new MouseEvent("click"));

    expect(onClick).toHaveBeenCalled();
  });

  it("handles empty points array", () => {
    g.datum([[], []]);
    g.call(pointsRenderer({ timeScale }));

    expect(g.selectAll("g.point").size()).toBe(0);
  });

  it("handles missing points in data array", () => {
    // When data[1] is undefined the renderer should treat it as empty
    g.datum([[]]);
    g.call(pointsRenderer({ timeScale }));

    expect(g.selectAll("g.point").size()).toBe(0);
  });

  it("positions point using timeScale", () => {
    const points = [makePoint("Positioned", "2001-01-01", 5)];
    g.datum([[], points]);
    g.call(pointsRenderer({ timeScale }));

    const transform = g.select("g.point").attr("transform");
    const expected = timeScale(new Date("2001-01-01"));
    // Extract x from "translate(x y)" and compare numerically
    const match = transform.match(/translate\(([\d.]+)/);
    expect(match).not.toBeNull();
    expect(parseFloat(match![1])).toBeCloseTo(expected, 0);
  });
});
