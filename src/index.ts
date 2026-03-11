import type { App, Plugin } from "vue";
import VueTimeline from "./components/VueTimeline.vue";
export type { TimelineItem, TimelineConfig, TimelineMargin } from "./types";
export {
  TimelineSpan,
  TimelinePoint,
  isTimelineSpan,
  isTimelinePoint,
} from "./types";

export { VueTimeline };

const plugin: Plugin = {
  install(app: App) {
    app.component("VueTimeline", VueTimeline);
  },
};

export default plugin;
