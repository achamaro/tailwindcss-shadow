import { describe, expect, it } from "vitest";

import { generateShadow } from "./colored-shadow";

describe("boxShadow生成", () => {
  it("shadow-sc-10", () => {
    const shadow = generateShadow(0.1);
    expect(shadow).toEqual([
      "0.78px 1.56px 1.81px -0.26px rgb(var(--tw-shadow-color-rgb) / calc(var(--tw-shadow-color-alpha, 1) * 0.51))",
      "2.22px 4.44px 5.19px -0.74px rgb(var(--tw-shadow-color-rgb) / calc(var(--tw-shadow-color-alpha, 1) * 0.51))",
      "3.00px 6.00px 7.00px -1.00px rgb(var(--tw-shadow-color-rgb) / calc(var(--tw-shadow-color-alpha, 1) * 0.52))",
    ]);
  });
});
