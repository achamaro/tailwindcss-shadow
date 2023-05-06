import { describe, expect, it } from "vitest";

import { generateShadowColor } from "./shadow-color";

describe("色生成", () => {
  it("HEX", () => {
    const color = generateShadowColor("#fff", (color) => color);
    expect(color).toEqual({
      alpha: 1,
      color: "rgb(255 255 255 / 1)",
      rgb: "255 255 255",
    });
  });

  it("RGB", () => {
    const color = generateShadowColor("rgb(255 255 255)", (color) => color);
    expect(color).toEqual({
      alpha: 1,
      color: "rgb(255 255 255 / 1)",
      rgb: "255 255 255",
    });
  });

  it("RGB/A", () => {
    const color = generateShadowColor(
      "rgb(255 255 255 / 0.2)",
      (color) => color
    );
    expect(color).toEqual({
      alpha: 0.2,
      color: "rgb(255 255 255 / 0.2)",
      rgb: "255 255 255",
    });
  });

  it("RGBA", () => {
    const color = generateShadowColor(
      "rgba(255, 255, 255, 0.5)",
      (color) => color
    );
    expect(color).toEqual({
      alpha: 0.5,
      color: "rgb(255 255 255 / 0.5)",
      rgb: "255 255 255",
    });
  });

  it("HSL", () => {
    const color = generateShadowColor("hsl(360deg 50% 50%)", (color) => color);
    expect(color).toEqual({
      alpha: 1,
      color: "rgb(191 63 63 / 1)",
      rgb: "191 63 63",
    });
  });

  it("デフォルトジェネレーター", () => {
    const color = generateShadowColor("#fff");
    expect(color).toEqual({
      alpha: 1,
      color: "rgb(191 191 191 / 1)",
      rgb: "191 191 191",
    });
  });
});
