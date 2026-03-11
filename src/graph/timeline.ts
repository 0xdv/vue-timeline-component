import * as d3 from "d3";
import type { ScaleTime } from "d3";

import { spansRenderer } from "./renderers/spans";
import { pointsRenderer } from "./renderers/points";
import axis from "./renderers/axis";
import zoom from "./zoom";
import cursor from "./renderers/cursor";
import layout from "./layout";
import type { TimelineConfig, TimelineSpan, TimelinePoint } from "../types";

export default (config: TimelineConfig) => {
  function init(selection: d3.Selection<any, any, any, any>): void {
    selection.selectAll("svg").remove();

    const data = selection.data();
    const datum = data[0] as [TimelineSpan[], TimelinePoint[]];
    const spanData = datum[0];
    const pointData = datum[1] ?? [];
    layout.generate(spanData, pointData);

    let {
      viewWidth = 800,
      viewHeight = 200,
      widthResizable = true,
      margin = { top: 0, bottom: 30, left: 15, right: 15 },
      onClick,
      showCursor = true,
    } = config;

    if (widthResizable) {
      viewWidth = selection.node()?.clientWidth ?? viewWidth;
    }

    const width = viewWidth - margin.right - margin.left;
    const height = viewHeight - margin.top - margin.bottom;

    const allDates: Date[] = [
      ...spanData.map((e) => e.start),
      ...spanData.map((e) => e.end ?? e.start),
      ...pointData.map((p) => p.date),
    ];

    const svg = selection
      .append("svg")
      .datum([spanData, pointData])
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom);

    const timeScale: ScaleTime<number, number> = d3
      .scaleTime()
      .domain([d3.min(allDates) as Date, d3.max(allDates) as Date])
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

    view.call(draw(timeScale, onClick, height, showCursor));
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
    onClick?: (item: TimelineSpan | TimelinePoint) => void,
    height?: number,
    showCursor?: boolean,
  ) {
    return (selection: d3.Selection<any, any, any, any>): void => {
      selection
        .data(selection.data())
        .call(
          spansRenderer({
            timeScale,
            onClick,
          }),
        )
        .call(
          pointsRenderer({
            timeScale,
            onClick,
          }),
        )
        .call(
          axis({
            timeScale,
            height: height ?? 200,
            romanCenturies: config.romanCenturies,
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
