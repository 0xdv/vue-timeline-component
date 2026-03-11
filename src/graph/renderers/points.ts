import type * as d3 from "d3";
import type { ScaleTime } from "d3";
import type { TimelineSpan, TimelinePoint } from "../../types";

interface RenderConfig {
  timeScale: ScaleTime<number, number>;
  onClick?: (item: TimelineSpan | TimelinePoint) => void;
}

export function pointsRenderer(config: RenderConfig) {
  return (selection: d3.Selection<any, any, any, any>): void => {
    const { timeScale, onClick } = config;

    const dataArr = selection.data()[0];
    const pointsData = (
      dataArr.length > 1 ? dataArr[1] : []
    ) as TimelinePoint[];

    const points = selection
      .selectAll<SVGGElement, TimelinePoint>("g.point")
      .data(pointsData);

    const g = points
      .enter()
      .append("g")
      .classed("point", true)
      .attr(
        "transform",
        (d: TimelinePoint) =>
          `translate(${timeScale(d.date)} ${(d.position ?? 0) * 22})`,
      )
      .on("click", (_event: MouseEvent, d: TimelinePoint) => {
        if (onClick) onClick(d);
      });

    // Add tooltip
    g.append("title").text((d: TimelinePoint) => d.description);

    // Diamond marker for point events
    g.append("polygon")
      .attr("points", "0,-8 8,0 0,8 -8,0")
      .attr("transform", "translate(0, 10)")
      .attr("fill", "rgba(238, 136, 85, 0.6)")
      .attr("stroke", "rgba(238, 136, 85, 0.9)")
      .attr("stroke-width", 1);

    g.append("text")
      .attr("x", 12)
      .attr("y", 10)
      .attr("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("font-size", "11px")
      .text((d: TimelinePoint) => d.description);

    points.attr(
      "transform",
      (d: TimelinePoint) =>
        `translate(${timeScale(d.date)} ${(d.position ?? 0) * 22})`,
    );
  };
}
