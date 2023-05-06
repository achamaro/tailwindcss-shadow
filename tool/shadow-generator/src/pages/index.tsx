import { GenerateShadowOptions } from "@achamaro/tailwindcss-shadow";
import { ReactNode, useState } from "react";
import dedent from "ts-dedent";

import { Point, SignedPoint } from "@/domain/values/point";

import { cn } from "../lib/cn";
import { InputField, InputSlider } from "./_index/form";
import { ConfigOptions, Options } from "./_index/options";
import Preview from "./_index/preview";

export default function Index() {
  const colors = [
    ["bg-sky-200", "shadow-sc-sky-200"],
    ["bg-sky-500", "shadow-sc-sky-500"],
    ["bg-rose-200", "shadow-sc-rose-200"],
    ["bg-rose-500", "shadow-sc-rose-500"],
    ["bg-lime-200", "shadow-sc-lime-200"],
    ["bg-lime-500", "shadow-sc-lime-500"],
  ];
  const [color, setColor] = useState(0);
  const [z, setZ] = useState(0);
  const zValue = Math.round(z * 100);

  const optionsState = useState<Options>({
    offset: new SignedPoint([-0.3, -0.6]),
    blur: 0.7,
    spread: -0.5,
    layerIntervalCurve: [new Point([0.5, 0]), new Point([0.5, 1])],
  });

  const shadowOptions: Required<GenerateShadowOptions> = {
    offset: optionsState[0].offset.value,
    blur: optionsState[0].blur,
    spread: optionsState[0].spread,
    layerCount: 3,
    layerIntervalCurve: optionsState[0].layerIntervalCurve.map(
      (p) => p.value
    ) as [[number, number], [number, number]],
  };

  const presets = [1, 5, ...[...Array(10)].map((_, i) => (i + 1) * 10)];
  const presetShadows = presets.map((v, _, arr) => {
    const z = v / Math.max(...arr);
    return [v, z] as const;
  });

  return (
    <main
      className={cn(
        "flex min-h-screen items-start justify-center gap-10 bg-sky-200 p-10",
        colors[color][0]
      )}
    >
      <div className="max-w-[1024px]">
        <div className="flex flex-wrap gap-10">
          {presetShadows.map(([v, z]) => (
            <Preview
              className={cn("w-[100px]", colors[color][1])}
              options={shadowOptions}
              z={z}
              key={v}
            >
              {v}
            </Preview>
          ))}
        </div>
        <div className="mt-20 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Preview
              z={z}
              options={shadowOptions}
              className={cn("w-[200px]", colors[color][1])}
            ></Preview>
            <InputField className="mt-10 w-[200px]">
              z
              <InputSlider value={z} onChange={setZ} />
            </InputField>
            <Code className="mt-4 w-[640px]">
              {dedent`
              className="${colors[color][1]} shadow-sc-${
                presets.includes(zValue) ? zValue : `[${zValue}]`
              }"
              `}
            </Code>

            <Code className="mt-4 w-[640px]">
              {dedent`
              // tailwindcss.config.js

              import { coloredShadow, shadowColor } from "@achamaro/tailwindcss-shadow";

              /** @type {import('tailwindcss').Config} */
              export default {
                // ...
                plugins: [
                  shadowColor(),
                  coloredShadow({
                    ${Object.entries(shadowOptions)
                      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                      .join(",\n")}
                  }),
                ],
              };
              `}
            </Code>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 grid w-[200px] grid-cols-2 flex-wrap gap-2">
          {colors.map((color, i) => (
            <button
              key={i}
              onClick={() => setColor(i)}
              className={cn(
                "rounded border border-white/80 p-1 text-center text-xs",
                color[0]
              )}
            >
              {color[0].replace("bg-", "")}
            </button>
          ))}
        </div>
        <ConfigOptions state={optionsState} />
      </div>
    </main>
  );
}

function Code({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <code
      className={cn(
        "whitespace-pre-wrap rounded border border-white/70 bg-white/50 p-2 text-xs",
        className
      )}
    >
      {children}
    </code>
  );
}
