import { describe, it, expect } from "vitest";
import { VueTimeline } from "../index";
import plugin from "../index";

describe("index exports", () => {
  it("exports VueTimeline component", () => {
    expect(VueTimeline).toBeDefined();
  });

  it("exports default plugin with install method", () => {
    expect(plugin).toBeDefined();
    expect(typeof plugin.install).toBe("function");
  });

  it("plugin.install registers VueTimeline component", () => {
    const registered: Record<string, unknown> = {};
    const mockApp = {
      component(name: string, comp: unknown) {
        registered[name] = comp;
      },
    };

    plugin.install(mockApp as any);

    expect(registered["VueTimeline"]).toBe(VueTimeline);
  });
});
