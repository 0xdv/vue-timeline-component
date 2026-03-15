import * as d3 from "d3";
import type { ScaleTime } from "d3";

import { spansRenderer } from "./renderers/spans";
import { pointsRenderer } from "./renderers/points";
import axis from "./renderers/axis";
import grid from "./renderers/grid";
import zoom from "./zoom";
import cursor from "./renderers/cursor";
import layout from "./layout";
import type { TimelineConfig, TimelineSpan, TimelinePoint } from "../types";

export default (config: TimelineConfig) => {
  let _view: d3.Selection<any, any, any, any> | undefined;
  let _svg: d3.Selection<any, any, any, any> | undefined;
  let _timeScale: ScaleTime<number, number> | undefined;
  let _onClick: ((item: TimelineSpan | TimelinePoint) => void) | undefined;
  let _height: number | undefined;
  let _showCursor: boolean | undefined;
  let _showGrid: boolean | undefined;
  let _initialized = false;

  function init(selection: d3.Selection<any, any, any, any>): void {
    const {
      widthResizable = true,
      margin = { top: 0, bottom: 30, left: 15, right: 15 },
    } = config;

    if (_initialized && widthResizable) {
      const clientWidth = selection.node()?.clientWidth ?? 0;
      if (clientWidth <= margin.left + margin.right) return;
    }
    _initialized = true;

    selection.selectAll("svg").remove();

    const data = selection.data();
    const datum = data[0] as [TimelineSpan[], TimelinePoint[]];
    const spanData = datum[0];
    const pointData = datum[1] ?? [];
    layout.generate(spanData, pointData, config.maxLevel);

    let {
      viewWidth = 800,
      viewHeight = 200,
      onClick,
      showCursor = true,
      showGrid = false,
    } = config;

    _onClick = onClick;
    _showCursor = showCursor;
    _showGrid = showGrid;

    if (widthResizable) {
      viewWidth = selection.node()?.clientWidth ?? viewWidth;
    }

    const width = viewWidth - margin.right - margin.left;
    _height = viewHeight - margin.top - margin.bottom;

    const allDates: Date[] = [
      ...spanData.map((e) => e.start),
      ...spanData.map((e) => e.end ?? e.start),
      ...pointData.map((p) => p.date),
    ];

    _svg = selection
      .append("svg")
      .datum([spanData, pointData])
      .attr("width", width + margin.right + margin.left)
      .attr("height", _height + margin.top + margin.bottom);

    _timeScale = d3
      .scaleTime()
      .domain([d3.min(allDates) as Date, d3.max(allDates) as Date])
      .range([0, width]);

    const graph = _svg
      .append("g")
      .classed("graph", true)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    _view = graph.append("g").classed("view", true);

    _svg.call(
      zoom({
        timeScale: _timeScale,
        view: _view,
        draw,
        onClick,
        height: _height,
        showCursor,
        showGrid,
      }),
    );

    _view.call(draw(_timeScale, onClick, _height, showCursor, showGrid));
  }

  function chart(selection: d3.Selection<any, any, any, any>): void {
    chart._init = () => init(selection);
    chart._selection = selection;
    chart._init();

    if (config.widthResizable) {
      globalThis.addEventListener("resize", chart._init, true);
    }
  }

  chart._init = undefined as (() => void) | undefined;
  chart._selection = undefined as d3.Selection<any, any, any, any> | undefined;

  chart.update = (spanData: TimelineSpan[], pointData: TimelinePoint[]) => {
    if (!_view || !_timeScale || !_svg) return;
    layout.generate(spanData, pointData, config.maxLevel);
    _view.datum([spanData, pointData]);

    const transform = d3.zoomTransform(_svg.node()!);
    const scale = transform.rescaleX(_timeScale);
    _view.call(draw(scale, _onClick, _height, _showCursor, _showGrid));
  };

  function draw(
    timeScale: ScaleTime<number, number>,
    onClick?: (item: TimelineSpan | TimelinePoint) => void,
    height?: number,
    showCursor?: boolean,
    showGrid?: boolean,
  ) {
    return (selection: d3.Selection<any, any, any, any>): void => {
      selection
        .data(selection.data())
        .call(
          grid({
            timeScale,
            height: height ?? 200,
            show: showGrid ?? false,
          }),
        )
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
