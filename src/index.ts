import type { App, Plugin } from "vue";
import VueTimeline from "./components/VueTimeline.vue";
export type {
  TimelineEvent,
  TimelineConfig,
  TimelineMargin,
} from "./graph/types";

export { VueTimeline };

const plugin: Plugin = {
  install(app: App) {
    app.component("VueTimeline", VueTimeline);
  },
};

export default plugin;
