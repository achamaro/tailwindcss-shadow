import { Dispatch, SetStateAction, useCallback } from "react";

import { Point, SignedPoint } from "@/domain/values/point";

import Bezier from "./bezier";
import { InputField, InputSlider, InputText } from "./form";
import Grid from "./grid";

export type Options = {
  offset: SignedPoint;
  blur: number;
  spread: number;
  layerIntervalCurve: [Point, Point];
};

export type ConfigOptionsProps = {
  state: [Options, Dispatch<SetStateAction<Options>>];
};

export function ConfigOptions({
  state: [options, setOptions],
}: ConfigOptionsProps) {
  const {
    offset,
    blur,
    spread,
    layerIntervalCurve: [layerP1, layerP2],
  } = options;

  // オプション更新関数
  const updateOptions = useCallback(
    <T extends keyof Options>(key: T, value: SetStateAction<Options[T]>) => {
      setOptions((prev) => ({
        ...prev,
        [key]: typeof value === "function" ? value(prev[key]) : value,
      }));
    },
    [setOptions]
  );

  // offset
  const setOffset = useCallback(
    (value: SignedPoint) => {
      updateOptions("offset", value);
    },
    [updateOptions]
  );
  function setOffsetX(value: number) {
    updateOptions("offset", (prev) => prev.updateAt(value, 0));
  }
  function setOffsetY(value: number) {
    updateOptions("offset", (prev) => prev.updateAt(value, 1));
  }

  // blur
  const setBlur = useCallback(
    (value: number) => {
      updateOptions("blur", value);
    },
    [updateOptions]
  );

  // spread
  const setSpread = useCallback(
    (value: number) => {
      updateOptions("spread", value);
    },
    [updateOptions]
  );

  // layer
  const setLayerP1 = useCallback(
    (value: Point) => {
      updateOptions("layerIntervalCurve", (prev) => [value, prev[1]]);
    },
    [updateOptions]
  );
  const setLayerP2 = useCallback(
    (value: Point) => {
      updateOptions("layerIntervalCurve", (prev) => [prev[0], value]);
    },
    [updateOptions]
  );

  return (
    <div className="">
      <Grid value={offset} setValue={setOffset} />
      <div className="mt-4 text-sm">
        <InputField className="">
          x
          <InputText value={offset.value[0]} min={-1} onChange={setOffsetX} />
        </InputField>
        <InputField className="mt-2">
          y
          <InputText value={offset.value[1]} min={-1} onChange={setOffsetY} />
        </InputField>

        <InputField className="mt-2">
          blur
          <InputSlider value={blur} onChange={setBlur} />
        </InputField>

        <InputField className="mt-2">
          spread
          <InputSlider value={spread} onChange={setSpread} min={-1} />
        </InputField>

        <div className="relative">
          <div className="pointer-events-none absolute left-2 top-1 text-xs text-gray-500">
            layer
          </div>
          <Bezier
            className="mt-2 w-[200px]"
            p1={[layerP1, setLayerP1]}
            p2={[layerP2, setLayerP2]}
          />
        </div>
      </div>
    </div>
  );
}
