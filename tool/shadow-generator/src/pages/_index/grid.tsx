import { useEffect, useRef } from "react";

import { Coordinates, SignedPoint } from "@/domain/values/point";

export type GridProps = {
  value: SignedPoint;
  setValue: (value: SignedPoint) => void;
  size?: number;
};
export default function Grid({ value, setValue, size = 200 }: GridProps) {
  const el = useRef<HTMLDivElement>(null);

  const pointStyle = {
    left: `${((value.value[0] + 1) / 2) * 100}%`,
    top: `${((value.value[1] + 1) / 2) * 100}%`,
  };

  useEffect(() => {
    function handleMousemove(e: MouseEvent) {
      e.preventDefault();
      setValue(getPoint(el.current!, e));
    }

    function handleMousedown(e: MouseEvent) {
      e.preventDefault();
      setValue(getPoint(el.current!, e));
      dragStart();
    }

    function dragStart() {
      window.addEventListener("mousemove", handleMousemove);
      window.addEventListener("mouseup", dragEnd);
    }

    function dragEnd() {
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("mouseup", dragEnd);
    }

    const element = el.current!;
    element.addEventListener("mousedown", handleMousedown);

    return () => {
      element.addEventListener("mousedown", handleMousedown);
      dragEnd();
    };
  }, [setValue]);

  return (
    <div ref={el} className="relative flex aspect-square">
      <svg
        viewBox={`0 0 ${size}.5 ${size}.5`}
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="smallGrid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <rect width="50" height="50" fill="url(#smallGrid)" />
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="gray"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div
        style={pointStyle}
        className="absolute aspect-square w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-500 bg-white"
      ></div>
    </div>
  );
}

function getPoint(el: HTMLDivElement, e: MouseEvent): SignedPoint {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  return new SignedPoint([x, y].map((v) => v * 2 - 1) as Coordinates);
}
