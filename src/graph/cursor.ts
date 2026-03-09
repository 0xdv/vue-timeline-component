import type * as d3 from "d3";
import type { ScaleTime } from "d3";

interface CursorConfig {
  showCursor: boolean;
  timeScale: ScaleTime<number, number>;
  height: number;
}

export default (config: CursorConfig) =>
  (selection: d3.Selection<any, any, any, any>): void => {
    const { timeScale, height } = config;

    const now = timeScale(Date.now());

    const cursor = selection
      .selectAll<SVGGElement, any>(".cursor")
      .data((d: any) => d as any);

    const g = cursor
      .enter()
      .append("g")
      .classed("cursor", true)
      .attr("transform", `translate(${now})`);

    g.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height)
      .attr("stroke", "red");

    cursor.attr("transform", `translate(${now})`);
  };
