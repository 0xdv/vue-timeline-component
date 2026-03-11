import { describe, it, expect, beforeEach } from "vitest";
import * as d3 from "d3";
import cursor from "../renderers/cursor";

function createSvg() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return d3.select(container).append("svg").append("g");
}

describe("cursor renderer", () => {
  let g: d3.Selection<SVGGElement, any, any, any>;
  let timeScale: d3.ScaleTime<number, number>;

  beforeEach(() => {
    document.body.innerHTML = "";
    g = createSvg();
    timeScale = d3
      .scaleTime()
      .domain([new Date("2000-01-01"), new Date("2030-01-01")])
      .range([0, 800]);
  });

  it("renders a cursor group with a red line", () => {
    g.datum([[], []]);
    g.call(
      cursor({
        showCursor: true,
        timeScale,
        height: 200,
      }),
    );

    const cursorGroup = g.select("g.cursor");
    expect(cursorGroup.empty()).toBe(false);

    const line = cursorGroup.select("line");
    expect(line.empty()).toBe(false);
    expect(line.attr("stroke")).toBe("red");
  });

  it("sets line height from config", () => {
    g.datum([[], []]);
    g.call(
      cursor({
        showCursor: true,
        timeScale,
        height: 150,
      }),
    );

    const line = g.select("g.cursor line");
    expect(line.attr("y2")).toBe("150");
  });

  it("positions cursor at current time", () => {
    g.datum([[], []]);
    g.call(
      cursor({
        showCursor: true,
        timeScale,
        height: 200,
      }),
    );

    const transform = g.select("g.cursor").attr("transform");
    const nowX = timeScale(Date.now());
    // The cursor position should be close to the current time mapping
    const match = transform.match(/translate\(([^)]+)\)/);
    expect(match).not.toBeNull();
    const x = parseFloat(match![1]);
    // Allow a small margin since Date.now() may differ slightly
    expect(Math.abs(x - nowX)).toBeLessThan(1);
  });
});
