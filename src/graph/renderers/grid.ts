import * as d3 from "d3";
import type { ScaleTime } from "d3";

const ROW_HEIGHT = 22 * 6;

interface GridConfig {
  timeScale: ScaleTime<number, number>;
  height: number;
  show?: boolean;
}

export default (config: GridConfig) =>
  (selection: d3.Selection<any, any, any, any>): void => {
    const { timeScale, height, show = true } = config;

    selection.selectAll(".grid").remove();

    if (!show) return;

    const ticks = timeScale.ticks();
    const width = timeScale.range()[1];
    const numRows = Math.ceil(height / ROW_HEIGHT);
    const rowYs = Array.from({ length: numRows + 1 }, (_, i) => i * ROW_HEIGHT);

    const gridGroup = selection
      .selectAll<SVGGElement, any>(".grid")
      .data([null])
      .enter()
      .append("g")
      .classed("grid", true)
      .lower();

    // Vertical lines at axis ticks
    gridGroup
      .selectAll<SVGLineElement, Date>("line.grid-v")
      .data(ticks)
      .enter()
      .append("line")
      .classed("grid-v", true)
      .attr("x1", (d: Date) => timeScale(d))
      .attr("x2", (d: Date) => timeScale(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#d0d0d0")
      .attr("stroke-width", 1)
      .attr("pointer-events", "none");

    // Horizontal lines at each row
    gridGroup
      .selectAll<SVGLineElement, number>("line.grid-h")
      .data(rowYs)
      .enter()
      .append("line")
      .classed("grid-h", true)
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (y) => y)
      .attr("y2", (y) => y)
      .attr("stroke", "#d0d0d0")
      .attr("stroke-width", 1)
      .attr("pointer-events", "none");
  };
