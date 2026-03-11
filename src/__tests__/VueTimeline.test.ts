import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import VueTimeline from "../components/VueTimeline.vue";
import { TimelineSpan, TimelinePoint } from "../types";

describe("VueTimeline component", () => {
  it("renders a div with class vue-timeline", () => {
    const wrapper = mount(VueTimeline, {
      props: {
        data: [
          new TimelineSpan(
            "Test",
            new Date("2000-01-01"),
            new Date("2001-01-01"),
          ),
        ],
      },
    });

    expect(wrapper.find(".vue-timeline").exists()).toBe(true);
  });

  it("creates SVG inside the timeline div", async () => {
    const wrapper = mount(VueTimeline, {
      props: {
        data: [
          new TimelineSpan(
            "Test",
            new Date("2000-01-01"),
            new Date("2001-01-01"),
          ),
        ],
      },
      attachTo: document.body,
    });

    // onMounted should create the SVG
    await wrapper.vm.$nextTick();
    expect(wrapper.find("svg").exists()).toBe(true);
    wrapper.unmount();
  });

  it("accepts points in data prop", async () => {
    const wrapper = mount(VueTimeline, {
      props: {
        data: [
          new TimelineSpan(
            "Span",
            new Date("2000-01-01"),
            new Date("2001-01-01"),
          ),
          new TimelinePoint(new Date("2000-06-01"), "Event"),
        ],
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("svg").exists()).toBe(true);
    wrapper.unmount();
  });

  it("accepts config prop", async () => {
    const wrapper = mount(VueTimeline, {
      props: {
        data: [
          new TimelineSpan(
            "Span",
            new Date("2000-01-01"),
            new Date("2001-01-01"),
          ),
        ],
        config: {
          viewHeight: 400,
          showCursor: false,
        },
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("svg").exists()).toBe(true);
    wrapper.unmount();
  });

  it("renders span elements in SVG", async () => {
    const wrapper = mount(VueTimeline, {
      props: {
        data: [
          new TimelineSpan(
            "Period A",
            new Date("2000-01-01"),
            new Date("2001-01-01"),
          ),
          new TimelineSpan(
            "Period B",
            new Date("2001-01-01"),
            new Date("2002-01-01"),
          ),
        ],
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();
    const spanGroups = wrapper.findAll("g.span");
    expect(spanGroups.length).toBe(2);
    wrapper.unmount();
  });
});
