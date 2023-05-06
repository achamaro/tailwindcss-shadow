import plugin from "tailwindcss/plugin";

export type GenerateShadowOptions = {
  /** オフセット -1 ~ 1 (Default:[-0.3, -0.6]) */
  offset?: [number, number];

  /** ぼかしの半径 0 ~ 1 (Default: 0.7) */
  blur?: number;

  /** 拡散の半径 -1 ~ 1 (Default: -0.5) */
  spread?: number;

  /** レイヤー数 (Default: 3) */
  layerCount?: number;

  /** レイヤーの配置間隔を求めるための三次ベジェ曲線の制御ポイント 0 ~ 1 */
  layerIntervalCurve?: [[number, number], [number, number]];
};

export type ColoredShadowOptions = {
  /** クラスの値の前に付与する接頭辞 (Default: "sc") */
  prefix?: string;
} & GenerateShadowOptions;

function defaultGenerateOptions(): GenerateShadowOptions {
  return {
    offset: [-0.3, -0.6],
    blur: 0.7,
    spread: -0.5,
    layerCount: 3,
    layerIntervalCurve: [
      [0.5, 0],
      [0.5, 1],
    ],
  };
}

/**
 * @param options Plugin options
 * @returns Tailwind CSS plugin
 */
export function coloredShadow(options: ColoredShadowOptions = {}) {
  const generateOptions = {
    ...defaultGenerateOptions(),
    ...options,
  };
  const { prefix = "sc" } = options;
  return plugin(
    ({ matchUtilities, theme }) => {
      matchUtilities(
        {
          [`shadow-${prefix}`]: (value: string) => {
            const shadows = generateShadow(
              Number(value) / 100,
              generateOptions
            );
            return {
              "box-shadow": shadows.join(", "),
            };
          },
        },
        {
          values: theme("coloredShadow"),
          type: "any",
        }
      );
    },
    {
      theme: {
        coloredShadow: Object.fromEntries(
          [1, 5, ...[...Array(10)].map((_, i) => (i + 1) * 10)].map((v) => [
            v,
            v,
          ])
        ),
      },
    }
  );
}

export function generateShadow(z: number, options: GenerateShadowOptions = {}) {
  const { offset, blur, spread, layerCount, layerIntervalCurve } = {
    ...defaultGenerateOptions(),
    ...options,
  } as Required<GenerateShadowOptions>;

  const shadowColorName = "--tw-shadow-color";

  return [...Array(layerCount)].map((_, i) => {
    const t = (i + 1) / layerCount;
    const layerZ =
      bezierPoint(layerIntervalCurve[0][1], layerIntervalCurve[1][1], t) * z;
    const [x, y] = offset.map((v) => -v * 100 * layerZ);
    const blurRadius = layerZ * (100 * blur);
    const spreadRadius = layerZ * 20 * spread;
    const opacity = 0.5 + layerZ * 0.2;
    return `${[x, y, blurRadius, spreadRadius]
      .map((v) => v.toFixed(2) + "px")
      .join(
        " "
      )} rgb(var(${shadowColorName}-rgb) / calc(var(${shadowColorName}-alpha, 1) * ${opacity.toFixed(
      2
    )}))`;
  });
}

/**
 * p0 = 0, p3 = 1 の三次ベジェ曲線のtの時の値を求める
 * @param p1 - 0 ~ 1 の値
 * @param p1 - 0 ~ 1 の値
 * @param t - 0 ~ 1 の値
 * @returns
 */
function bezierPoint(p1: number, p2: number, t: number) {
  return (
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * Math.pow(t, 2) * p2 +
    Math.pow(t, 3)
  );
}
