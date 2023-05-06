import convert from "color-convert";
import type { HSL, HSV, RGB } from "color-convert/conversions";
import type { Result } from "parse-css-color";
import parseColor from "parse-css-color";
import plugin from "tailwindcss/plugin";

export interface ColorResult extends Result {
  type: "rgb" | "hsl" | "hsv";
}

export type GeneratorFunction = (
  hsv: ColorResult,
  original: ColorResult
) => ColorResult;

export type ShadowColorOptions = {
  utilities?: Record<string, string>;
  prefix?: string;
  generator?: GeneratorFunction;
};

const defaultGenerator: GeneratorFunction = (hsv) => {
  // 明度を下げる
  hsv.values[2] = Math.max(0, hsv.values[2] - 25);
  return hsv;
};

/**
 * @param options Plugin options
 * @returns Tailwind CSS plugin
 */
export function shadowColor({
  utilities: utilityPropMap = { shadow: "--tw-shadow-color" },
  prefix = "sc",
  generator = defaultGenerator,
}: ShadowColorOptions = {}) {
  return plugin(({ matchUtilities, theme }) => {
    matchUtilities(createUtilities(utilityPropMap, prefix, generator), {
      values: flattenColorPalette(theme("colors")),
      type: ["color"],
    });
  });
}

/**
 * 指定された色を元に影色を生成する
 * @param value - 色文字列
 * @param generator - 色生成関数
 * @returns generatorによって生成された色文字列
 */
export function generateShadowColor(
  value: string,
  generator: GeneratorFunction = defaultGenerator
): { rgb: string; alpha: number; color: string } | null {
  const parsedColorResult = parseColor(value) as ColorResult;
  if (!parsedColorResult) {
    // 無効な値は無視する
    return null;
  }

  const hsvColor =
    parsedColorResult.type === "rgb"
      ? convert.rgb.hsv(parsedColorResult.values as RGB | HSL)
      : convert.hsl.hsv(parsedColorResult.values as RGB | HSL);

  // 元の色を元に影色を生成
  const generatedColorInfo = generator(
    { ...parsedColorResult, type: "hsv", values: hsvColor },
    { ...parsedColorResult }
  );

  // VSCode拡張の `Tailwind CSS IntelliSense(bradlc.vscode-tailwindcss)` で
  // 色のプレビューが表示されるようにRGBで出力する
  let rgbColor: RGB;
  switch (generatedColorInfo.type) {
    case "hsl":
      rgbColor = convert.hsl.rgb(generatedColorInfo.values as HSL);
      break;
    case "hsv":
      rgbColor = convert.hsv.rgb(generatedColorInfo.values as HSV);
      break;
    default:
      rgbColor = generatedColorInfo.values as RGB;
  }

  const rgb = rgbColor.join(" ");
  const alpha = generatedColorInfo.alpha;

  return {
    color: `rgb(${rgb} / ${alpha})`,
    rgb,
    alpha,
  };
}

/**
 *
 * @param utilities - ユーティリティクラスとカスタムプロパティ名のマップ
 * @param prefix - 色の前に置く接頭辞 scを指定した場合の例）shadow-sc-sky-400
 * @param generator 色生成関数
 * @returns ユーティリティ
 */
function createUtilities(
  utilities: Record<string, string>,
  prefix: string,
  generator: GeneratorFunction
) {
  return Object.fromEntries(
    Object.entries(utilities).map(([className, propName]) => [
      `${className}-${prefix}`,
      (value: string) => {
        const generated = generateShadowColor(value, generator);
        if (!generated) {
          return {};
        }

        const { color, rgb, alpha } = generated;
        return {
          [propName]: color,
          [`${propName}-rgb`]: rgb,
          [`${propName}-alpha`]: String(alpha),
        };
      },
    ])
  );
}

// tailwindcss/src/util/flattenColorPalette.js
type Colors = { [key: string]: string | Colors };
function flattenColorPalette(colors: Colors): Record<string, string> {
  return Object.assign(
    {},
    ...(Object.entries(colors ?? {}) as [string, string | Colors][]).flatMap(
      ([color, values]: [string, string | Colors]) =>
        isColors(values)
          ? Object.entries(flattenColorPalette(values)).map(
              ([number, hex]) => ({
                [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex,
              })
            )
          : [{ [`${color}`]: values }]
    )
  );
}

function isColors(colors: string | Colors): colors is Colors {
  return typeof colors === "object";
}
