import type * as d3 from "d3";
import type { ScaleTime } from "d3";
import type { TimelineSpan, TimelinePoint } from "../../types";

interface RenderConfig {
  timeScale: ScaleTime<number, number>;
  onClick?: (item: TimelineSpan | TimelinePoint) => void;
}

export function spansRenderer(config: RenderConfig) {
  return (selection: d3.Selection<any, any, any, any>): void => {
    const { timeScale, onClick } = config;

    const spans = selection
      .selectAll<SVGGElement, TimelineSpan>("g.span")
      .data(selection.data()[0][0] as TimelineSpan[], (d: any) => d.name);

    spans.exit().transition().duration(200).style("opacity", 0).remove();

    const g = spans
      .enter()
      .append("g")
      .classed("span", true)
      .attr(
        "transform",
        (d: TimelineSpan) =>
          `translate(${timeScale(d.start)} ${(d.position ?? 0) * 22})`,
      )
      .style("opacity", 0)
      .on("click", (_event: MouseEvent, d: TimelineSpan) => {
        if (onClick) onClick(d);
      });

    g.transition().duration(300).style("opacity", 1);

    // Add tooltip
    g.append("title").text((d: TimelineSpan) => d.name);

    g.append("rect")
      .attr("width", (d: TimelineSpan) =>
        d.end ? timeScale(d.end) - timeScale(d.start) : 10,
      )
      .attr("height", 20)
      .attr("fill", (d: TimelineSpan) => d.color ?? "rgba(85, 187, 238, 0.2)")
      .attr("ry", 6);

    // Clip path per span so text is clipped inside the span
    g.append("clipPath")
      .attr("id", (_d: TimelineSpan, i: number) => `span-clip-${i}`)
      .append("rect")
      .attr("width", (d: TimelineSpan) =>
        d.end ? timeScale(d.end) - timeScale(d.start) : 10,
      )
      .attr("height", 20);

    g.append("text")
      .attr(
        "x",
        (d: TimelineSpan) =>
          (d.end ? timeScale(d.end) - timeScale(d.start) : 10) / 2,
      )
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr(
        "clip-path",
        (_d: TimelineSpan, i: number) => `url(#span-clip-${i})`,
      )
      .style("pointer-events", "none")
      .text((d: TimelineSpan) => d.name);

    spans
      .attr(
        "transform",
        (d: TimelineSpan) =>
          `translate(${timeScale(d.start)} ${(d.position ?? 0) * 22})`,
      )
      .selectAll("rect")
      .attr("width", (d: any) =>
        d.end ? timeScale(d.end) - timeScale(d.start) : 10,
      );

    spans
      .selectAll<SVGTextElement, TimelineSpan>("text")
      .attr(
        "x",
        (d: TimelineSpan) =>
          (d.end ? timeScale(d.end) - timeScale(d.start) : 10) / 2,
      );
  };
}
