import type * as d3 from "d3";
import type { ScaleTime } from "d3";
import type { TimelineEvent } from "./types";

interface EventsConfig {
  timeScale: ScaleTime<number, number>;
  onEventClick?: (event: TimelineEvent) => void;
}

export default (config: EventsConfig) =>
  (selection: d3.Selection<any, any, any, any>): void => {
    const { timeScale, onEventClick } = config;

    const events = selection
      .selectAll<SVGGElement, TimelineEvent>("g.event")
      .data(selection.data()[0][0] as TimelineEvent[]);

    const g = events
      .enter()
      .append("g")
      .classed("event", true)
      .attr(
        "transform",
        (d: TimelineEvent) =>
          `translate(${timeScale(d.start)} ${(d.position ?? 0) * 22})`,
      )
      .on("click", (_event: MouseEvent, d: TimelineEvent) => {
        if (onEventClick) onEventClick(d);
      });

    // Add tooltip
    g.append("title").text((d: TimelineEvent) => d.name);

    g.append("rect")
      .attr("width", (d: TimelineEvent) =>
        d.end ? timeScale(d.end) - timeScale(d.start) : 10,
      )
      .attr("height", 20)
      .attr("fill", "rgba(85, 187, 238, 0.2)")
      .attr("ry", 6);

    // Clip path per event so text is clipped inside the span
    g.append("clipPath")
      .attr("id", (_d: TimelineEvent, i: number) => `event-clip-${i}`)
      .append("rect")
      .attr("width", (d: TimelineEvent) =>
        d.end ? timeScale(d.end) - timeScale(d.start) : 10,
      )
      .attr("height", 20);

    g.append("text")
      .attr(
        "x",
        (d: TimelineEvent) =>
          (d.end ? timeScale(d.end) - timeScale(d.start) : 10) / 2,
      )
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr(
        "clip-path",
        (_d: TimelineEvent, i: number) => `url(#event-clip-${i})`,
      )
      .style("pointer-events", "none")
      .text((d: TimelineEvent) => d.name);

    events
      .attr(
        "transform",
        (d: TimelineEvent) =>
          `translate(${timeScale(d.start)} ${(d.position ?? 0) * 22})`,
      )
      .selectAll("rect")
      .attr("width", (d: any) =>
        d.end ? timeScale(d.end) - timeScale(d.start) : 10,
      );

    events
      .selectAll<SVGTextElement, TimelineEvent>("text")
      .attr(
        "x",
        (d: TimelineEvent) =>
          (d.end ? timeScale(d.end) - timeScale(d.start) : 10) / 2,
      );
  };
