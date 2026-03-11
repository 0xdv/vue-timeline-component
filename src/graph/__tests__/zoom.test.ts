import { describe, it, expect } from "vitest";
import * as d3 from "d3";
import zoom from "../zoom";

describe("zoom", () => {
  it("returns a d3 zoom behavior", () => {
    const timeScale = d3
      .scaleTime()
      .domain([new Date("2000-01-01"), new Date("2005-01-01")])
      .range([0, 800]);

    const container = document.createElement("div");
    const svg = d3.select(container).append("svg");
    const view = svg.append("g");

    const draw = (scale: d3.ScaleTime<number, number>) => {
      return (_sel: d3.Selection<any, any, any, any>) => {};
    };

    const zoomBehavior = zoom({ timeScale, view, draw });

    // Should return a zoom behavior (function with .on method)
    expect(typeof zoomBehavior).toBe("function");
    expect(typeof zoomBehavior.on).toBe("function");
    expect(typeof zoomBehavior.scaleExtent).toBe("function");
  });

  it("can be applied to an SVG element", () => {
    const timeScale = d3
      .scaleTime()
      .domain([new Date("2000-01-01"), new Date("2005-01-01")])
      .range([0, 800]);

    const container = document.createElement("div");
    const svg = d3.select(container).append("svg");
    const view = svg.append("g");

    const draw = (scale: d3.ScaleTime<number, number>) => {
      return (_sel: d3.Selection<any, any, any, any>) => {};
    };

    const zoomBehavior = zoom({ timeScale, view, draw });

    // Applying zoom should not throw
    expect(() => svg.call(zoomBehavior)).not.toThrow();
  });

  it("has zoom event listener registered", () => {
    const timeScale = d3
      .scaleTime()
      .domain([new Date("2000-01-01"), new Date("2005-01-01")])
      .range([0, 800]);

    const container = document.createElement("div");
    const svg = d3.select(container).append("svg");
    const view = svg.append("g");

    const draw = (scale: d3.ScaleTime<number, number>) => {
      return (_sel: d3.Selection<any, any, any, any>) => {};
    };

    const zoomBehavior = zoom({ timeScale, view, draw });
    // The zoom behavior should have registered a "zoom" event
    expect(zoomBehavior.on("zoom")).toBeDefined();
  });
});
