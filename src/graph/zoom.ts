import * as d3 from "d3";
import type { ScaleTime } from "d3";

interface ZoomConfig {
  timeScale: ScaleTime<number, number>;
  view: d3.Selection<any, any, any, any>;
  draw: (
    timeScale: ScaleTime<number, number>,
    onClick?: (item: any) => void,
    height?: number,
    showCursor?: boolean,
  ) => (selection: d3.Selection<any, any, any, any>) => void;
}

export default (config: ZoomConfig): d3.ZoomBehavior<any, any> => {
  const { timeScale, view, draw } = config;

  return d3.zoom<any, any>().on("zoom", (event: d3.D3ZoomEvent<any, any>) => {
    const { k, x, y } = event.transform;

    const scale = d3.zoomIdentity.translate(x, y).scale(k).rescaleX(timeScale);

    view.call(draw(scale));
  });
};
