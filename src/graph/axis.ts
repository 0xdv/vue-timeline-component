import * as d3 from "d3";
import type { ScaleTime } from "d3";

interface AxisConfig {
  timeScale: ScaleTime<number, number>;
  height: number;
}

function format(date: Date): string {
  if (d3.timeDay(date) < date) {
    return d3.timeFormat("%I:%M")(date);
  }

  if (d3.timeMonth(date) < date) {
    return d3.timeFormat("%b %d")(date);
  }

  if (d3.timeYear(date) < date) {
    return d3.timeFormat("%B")(date);
  }

  return d3.timeFormat("%Y")(date);
}

export default (config: AxisConfig) =>
  (selection: d3.Selection<any, any, any, any>): void => {
    const { timeScale, height } = config;

    const axe = selection
      .selectAll<SVGGElement, any>(".axe")
      .data((d: any) => d as any);

    const ay = d3
      .axisBottom(timeScale)
      .tickFormat((d: Date | d3.NumberValue) => format(d as Date));

    axe
      .enter()
      .append("g")
      .attr("transform", `translate(0, ${height + 5})`)
      .classed("axe", true)
      .call(ay as any);

    axe.call(ay as any);
  };
