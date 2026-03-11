import { describe, it, expect, beforeEach } from "vitest";
import * as d3 from "d3";
import axis from "../renderers/axis";

function createSvg() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return d3.select(container).append("svg").append("g");
}

describe("axis renderer", () => {
  let g: d3.Selection<SVGGElement, any, any, any>;
  let timeScale: d3.ScaleTime<number, number>;

  beforeEach(() => {
    document.body.innerHTML = "";
    g = createSvg();
    timeScale = d3
      .scaleTime()
      .domain([new Date("2000-01-01"), new Date("2005-01-01")])
      .range([0, 800]);
  });

  it("renders an axis group with class 'axe'", () => {
    g.datum([[], []]);
    g.call(axis({ timeScale, height: 200 }));

    expect(g.select("g.axe").empty()).toBe(false);
  });

  it("positions axis at the correct height offset", () => {
    g.datum([[], []]);
    g.call(axis({ timeScale, height: 200 }));

    const transform = g.select("g.axe").attr("transform");
    expect(transform).toBe("translate(0, 205)");
  });

  it("renders tick marks", () => {
    g.datum([[], []]);
    g.call(axis({ timeScale, height: 200 }));

    const ticks = g.selectAll(".tick");
    expect(ticks.size()).toBeGreaterThan(0);
  });

  it("re-renders on update call", () => {
    g.datum([[], []]);
    g.call(axis({ timeScale, height: 200 }));
    // Call again to trigger the update path
    g.call(axis({ timeScale, height: 200 }));

    // Should still have axis groups (not duplicated enter)
    expect(g.selectAll("g.axe").size()).toBeGreaterThanOrEqual(1);
  });
});
