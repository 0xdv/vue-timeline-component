/**
 * @module
 * Vue 3 timeline component for rendering time spans and point events using D3.js.
 *
 * @example
 * ```ts
 * import { createApp } from "vue";
 * import VueTimelinePlugin, { VueTimeline } from "@0xdv/vue-timeline-component";
 *
 * // Register globally
 * createApp(App).use(VueTimelinePlugin).mount("#app");
 *
 * // Or use directly
 * import { VueTimeline } from "@0xdv/vue-timeline-component";
 * ```
 */
import type { App, Plugin } from "vue";
import VueTimeline from "./components/VueTimeline.vue";
export type { TimelineItem, TimelineConfig, TimelineMargin } from "./types";
export {
  TimelineSpan,
  TimelinePoint,
  isTimelineSpan,
  isTimelinePoint,
} from "./types";

/** The VueTimeline component for direct use in templates. */
export { VueTimeline };

/**
 * Vue plugin that globally registers the `VueTimeline` component.
 *
 * @example
 * ```ts
 * import { createApp } from "vue";
 * import VueTimelinePlugin from "@0xdv/vue-timeline-component";
 *
 * createApp(App).use(VueTimelinePlugin).mount("#app");
 * ```
 */
const plugin: Plugin = {
  install(app: App) {
    app.component("VueTimeline", VueTimeline);
  },
};

export default plugin;
