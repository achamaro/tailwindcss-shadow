import { RefObject, useCallback, useRef } from "react";

import { Point } from "@/domain/values/point";

import { cn } from "../../lib/cn";
import { DragPosition, useDragOnRect } from "../_global/hooks/use-drag-on-rect";

export type BezierProps = {
  className?: string;
  p1: [Point, (value: Point) => void];
  p2: [Point, (value: Point) => void];
};
export default function Bezier({ className, p1, p2 }: BezierProps) {
  const container = useRef<HTMLDivElement>(null);

  // y軸の値を反転させる
  const p1x = p1[0].value[0];
  const p1y = (1 - p1[0].value[1]) / 2;
  const p2x = p2[0].value[0];
  const p2y = (1 - p2[0].value[1]) / 2;

  return (
    <div
      ref={container}
      className={cn("relative flex aspect-[2/1]", className)}
    >
      <svg
        viewBox="0 0 1 0.5"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M 0 0.5 C ${p1x} ${p1y}, ${p2x} ${p2y}, 1 0`}
          fill="none"
          stroke="gray"
          strokeWidth="0.002"
        />
        <rect
          x="0"
          y="0"
          width="1"
          height="0.5"
          fill="none"
          stroke="gray"
          strokeWidth="0.005"
        />
        <line
          x1="0"
          y1="0.5"
          x2={p1x}
          y2={p1y}
          stroke="gray"
          strokeWidth="0.002"
          strokeDasharray="0.015"
        />
        <line
          x1="1"
          y1="0"
          x2={p2x}
          y2={p2y}
          stroke="gray"
          strokeWidth="0.002"
          strokeDasharray="0.015"
        />
      </svg>

      <ControlPoint p={p1} container={container} />
      <ControlPoint p={p2} container={container} />
    </div>
  );
}

type ControlPointProps = {
  className?: string;
  p: [Point, (value: Point) => void];
  container: RefObject<HTMLDivElement>;
};
function ControlPoint({ className, p, container }: ControlPointProps) {
  const [_p, setP] = p;
  const position = pointToDragPosition(_p);
  const setPosition = useCallback(
    (value: DragPosition) => {
      setP(dragPositionToPoint(value));
    },
    [setP]
  );

  const { dragStart } = useDragOnRect([position, setPosition], container);

  const style = {
    left: `${position[0] * 100}%`,
    top: `${position[1] * 100}%`,
  };

  return (
    <div
      className={cn(
        "absolute aspect-square w-[10px] -translate-x-1/2 -translate-y-1/2  rounded-full border border-gray-500 bg-white",
        className
      )}
      style={style}
      onMouseDown={dragStart}
    ></div>
  );
}

function pointToDragPosition(value: Point) {
  return [value.value[0], 1 - value.value[1]] as DragPosition;
}

function dragPositionToPoint(value: DragPosition) {
  return new Point([value[0], 1 - value[1]]);
}
