import * as d3 from "d3";
import type { ScaleTime } from "d3";

import eventsRenderer from "./events";
import axis from "./axis";
import zoom from "./zoom";
import cursor from "./cursor";
import layout from "./layout";
import type { TimelineConfig, TimelineEvent } from "./types";

export default (config: TimelineConfig) => {
  function init(selection: d3.Selection<any, any, any, any>): void {
    selection.selectAll("svg").remove();

    const data = selection.data();
    const eventData = data[0] as TimelineEvent[];
    layout.generate(eventData);

    let {
      viewWidth = 800,
      viewHeight = 200,
      widthResizable = true,
      margin = { top: 0, bottom: 30, left: 15, right: 15 },
      onEventClick,
      showCursor = true,
    } = config;

    if (widthResizable) {
      viewWidth = selection.node()?.clientWidth ?? viewWidth;
    }

    const width = viewWidth - margin.right - margin.left;
    const height = viewHeight - margin.top - margin.bottom;

    const svg = selection
      .append("svg")
      .datum(data)
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom);

    const timeScale: ScaleTime<number, number> = d3
      .scaleTime()
      .domain([
        d3.min(eventData.map((e) => e.start)) as Date,
        d3.max(eventData.map((e) => e.end ?? e.start)) as Date,
      ])
      .range([0, width]);

    const graph = svg
      .append("g")
      .classed("graph", true)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const view = graph.append("g").classed("view", true);

    svg.call(
      zoom({
        timeScale,
        view,
        draw,
      }),
    );

    view.call(draw(timeScale, onEventClick, height, showCursor));
  }

  function chart(selection: d3.Selection<any, any, any, any>): void {
    chart._init = () => init(selection);
    chart._init();

    if (config.widthResizable) {
      globalThis.addEventListener("resize", chart._init, true);
    }
  }

  chart._init = undefined as (() => void) | undefined;

  function draw(
    timeScale: ScaleTime<number, number>,
    onEventClick?: (event: TimelineEvent) => void,
    height?: number,
    showCursor?: boolean,
  ) {
    return (selection: d3.Selection<any, any, any, any>): void => {
      selection
        .data(selection.data())
        .call(
          eventsRenderer({
            timeScale,
            onEventClick,
          }),
        )
        .call(
          axis({
            timeScale,
            height: height ?? 200,
          }),
        )
        .call(
          cursor({
            showCursor: showCursor ?? true,
            timeScale,
            height: height ?? 200,
          }),
        );
    };
  }

  return chart;
};
